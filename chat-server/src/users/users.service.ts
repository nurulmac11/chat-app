import {BadRequestException, Injectable, Logger} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Brackets, createQueryBuilder, getConnection, Repository} from "typeorm";
import {User} from "./user.entity";
import {Message} from "../messages/messages.entity";
import {JwtService} from './jwt/jwt.service';
import {UserSchema} from "./jwt/user.schema";
import * as bcrypt from 'bcrypt';
import {Favorites} from "./favorites.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Message)
        private messagesRepository: Repository<Message>,
        private readonly jwtService: JwtService
    ) {
    }

    private logger: Logger = new Logger('UserService');

    // JWT METHODS
    async validate(username: string, password: string): Promise<any> {
        const user = await this.findByUsername(username);
        const pass = await bcrypt.compare(password, user.password);
        if (pass)
            return user;
        return false;
    }

    public userSerializer(user: User): Record<string, any> {
        return {
            id: user.id,
            username: user.username,
            gender: user.gender,
            age: user.age,
            biography: user.biography,
            ppUrl: user.ppUrl,
            createdAt: user.createdAt,
            lastOnline: user.lastOnline,
            conversations: user.conversations,
            email: user.email,
            anon: user.anonymousName,
        }
    }

    public async login(username: string, password: string): Promise<any | { status: number }> {
        const user = await this.validate(username, password);
        if (!user) {
            this.logger.log('usr not found');
            return false;
        } else {
            this.logger.log('usr found!');

        }
        const tokens = await this.jwtService.generateToken(user);

        return {
            // eslint-disable-next-line @typescript-eslint/camelcase
            expires_in: 3600,
            // eslint-disable-next-line @typescript-eslint/camelcase
            tokens,
            // eslint-disable-next-line @typescript-eslint/camelcase
            user_id: user.id,
            profile: this.userSerializer(user),
            status: 200
        };
    }


    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async findMsgsOfChat(user1: number, user2: number): Promise<any> {
        return await createQueryBuilder('Message')
            .where(new Brackets(qb => {
                qb.where('Message.sender = :id1', {id1: user1})
                    .andWhere('Message.receiver = :id2', {id2: user2})
            }))
            .orWhere(new Brackets(qb => {
                qb.where('Message.sender = :id3', {id3: user2})
                    .andWhere('Message.receiver = :id4', {id4: user1})
            }))
            .getMany();
    }

    // returns messages that user sent
    async findMsgsOfUser(id: number): Promise<any> {
        return await createQueryBuilder('User')
            .leftJoinAndSelect('User.sent_messages', 'messages')
            .where('User.id = :id', {id})
            .getMany();
    }

    async findById(id: number): Promise<UserSchema> {
        const user = await this.usersRepository.findOne(id);
        const clientSchema = new UserSchema;
        clientSchema.id = user.id;
        clientSchema.username = user.username;
        clientSchema.email = user.email;
        return clientSchema;
    }

    async findRandomOnlineUsers(): Promise<any> {
        const currentTime = Date.now()
        const lastUsers = await createQueryBuilder('User')
            .select(["User.id", "User.username", "User.gender", "User.age", "User.biography", "User.ppUrl", "User.lastOnline", "User.conversations"])
            .orderBy("RAND()")
            .limit(10)
            .getMany();
        return lastUsers;
    }

    async findUserById(id: number): Promise<User> {
        return await this.usersRepository.findOne(id);
    }

    async updateBio(id: number, bio: string): Promise<Record<string, any>> {
        const isUpdated = await createQueryBuilder()
            .update(User)
            .set({biography: bio})
            .where("id = :id", {id: id})
            .execute();
        if (isUpdated) {
            const user = await this.findUserById(id);
            return this.userSerializer(user);
        }
    }

    async updateAvatar(id: number, imageName: string): Promise<any> {
        await createQueryBuilder()
            .update(User)
            .set({ppUrl: imageName})
            .where("id = :id", {id: id})
            .execute();
        const user = await this.findUserById(id);
        return this.userSerializer(user);
    }

    async updateLastOnline(id: number): Promise<void> {
        await createQueryBuilder()
            .update(User)
            .set({lastOnline: Date.now()})
            .where("id = :id", {id: id})
            .execute();
    }

    async findByAnon(anon: string): Promise<any> {
        const user = await createQueryBuilder('User')
            .where('User.anonymousName = :anon', {anon})
            .getOne();
        return user;
    }

    async findByUsername(username: string): Promise<any> {
        const user = await createQueryBuilder('User')
            .where('User.username = :username', {username})
            .getOne();
        return user;
    }

    async addFavorite(user: User, favorite: number): Promise<any> {
        const favoriteUser = await this.findUserById(favorite)
        const fav = new Favorites()
        fav.user = user;
        fav.favorite = favoriteUser;
        try {
            await fav.save();
            return true;
        } catch (Exception) {
            return false;
        }
    }

    async create(username: string, password: string, email: string, gender: string, age: number): Promise<any> {
        const user = new User();
        user.username = username;
        user.password = password;
        user.email = email;
        user.gender = gender;
        user.age = age;
        try {
            await user.save();
        } catch (Exception) {
            return false;
        }
        return user;
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
