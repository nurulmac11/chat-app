import {BadRequestException, forwardRef, Inject, Injectable, Logger} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Brackets, createQueryBuilder, getConnection, Repository} from "typeorm";
import {User} from "./user.entity";
import {Message} from "../messages/messages.entity";
import {JwtService} from './jwt/jwt.service';
import {UserSchema} from "./jwt/user.schema";
import * as bcrypt from 'bcrypt';
import {Favorites} from "./favorites.entity";
import {Blocks} from "./blocks.entity";
import {TypeOrmCrudService} from "@nestjsx/crud-typeorm";
import {Reports} from "./reports.entity";

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Message)
        private messagesRepository: Repository<Message>,
        @Inject(forwardRef(() => Favorites))
        private favoritesRepository: Repository<Favorites>,
        private readonly jwtService: JwtService
    ) {
        super(usersRepository);
    }

    private logger: Logger = new Logger('UserService');

    // JWT METHODS
    async validate(username: string, password: string): Promise<any> {
        const user = await this.findByUsername(username);
        if (!user) {
            return false;
        }
        const pass = await bcrypt.compare(password, user.password);
        if (pass) {
            return user;
        }
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
            isOnline: user.isOnline
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

    async findById(id: number): Promise<UserSchema> {
        const user = await this.usersRepository.findOne(id);
        const clientSchema = new UserSchema;
        clientSchema.id = user.id;
        clientSchema.username = user.username;
        clientSchema.email = user.email;
        clientSchema.isAdmin = user.isAdmin;
        return clientSchema;
    }

    async findRandomOnlineUsers(): Promise<any> {
        const currentTime = Date.now()
        const lastUsers = await createQueryBuilder('User')
            .select(["User.id", "User.username", "User.gender", "User.age", "User.biography", "User.ppUrl",
                "User.lastOnline", "User.conversations", "User.isOnline"])
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
            .set({lastOnline: Date.now(), isOnline: true})
            .where("id = :id", {id: id})
            .execute();
    }

    async disconnected(id: number): Promise<void> {
        await createQueryBuilder()
            .update(User)
            .set({lastOnline: Date.now(), isOnline: false})
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
            .where('User.username = :username and User.isActive = 1', {username})
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

    async removeFavorite(user: User, favorite: number): Promise<any> {
        const favoriteUser = await this.findUserById(favorite)
        try {
            await getConnection()
                .createQueryBuilder()
                .delete()
                .from(Favorites)
                .where("user = :id and favorite = :id2", {id: user.id, id2: favorite})
                .execute();
            return true;
        } catch (Exception) {
            console.log(Exception);
            return false;
        }
    }

    async findUserWithFavorites(id: number): Promise<any> {
        const favs = await createQueryBuilder('User')
            .select(['User.id', 'favs.id', 'favorite.id', 'favorite.username', 'favorite.gender', 'favorite.age',
                'favorite.biography', 'favorite.ppUrl', 'favorite.createdAt', 'favorite.lastOnline', 'favorite.conversations',
                'favorite.isOnline'])
            .leftJoin('User.favorites', 'favs')
            .leftJoin('favs.favorite', 'favorite')
            .where('User.id = :id', {id})
            .getOne();
        return favs;
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

    // BLOCK OPERATIONS
    async block(user: User, blockUserID: number, blockUsername: string): Promise<any> {
        let blockUser = undefined;
        if (blockUsername)
            blockUser = await this.findByAnon(blockUsername);
        else
            blockUser = await this.findUserById(blockUserID);

        const block = new Blocks()
        block.user = user;
        block.blocked = blockUser;
        try {
            await block.save();
            return true;
        } catch (Exception) {
            return false;
        }
    }

    async removeBlock(user: User, blockUserID: number, blockUsername): Promise<any> {
        let blockUser;
        if (blockUsername)
            blockUser = await this.findByAnon(blockUsername);
        else
            blockUser = await this.findUserById(blockUserID);

        try {
            await getConnection()
                .createQueryBuilder()
                .delete()
                .from(Blocks)
                .where("user = :id and blocked = :id2", {id: user.id, id2: blockUser.id})
                .execute();
            return true;
        } catch (Exception) {
            console.log(Exception);
            return false;
        }
    }

    async findUserWithBlocks(id: number): Promise<any> {
        const blocks = await createQueryBuilder('User')
            .select(['User.id', 'blocks.id', 'blocked.id', 'blocked.username', 'blocked.gender', 'blocked.age',
                'blocked.biography', 'blocked.ppUrl', 'blocked.createdAt', 'blocked.lastOnline', 'blocked.conversations'])
            .leftJoin('User.blocks', 'blocks')
            .leftJoin('blocks.blocked', 'blocked')
            .where('User.id = :id', {id})
            .getOne();
        return blocks;
    }

    async incrementConversationCount(id: number): Promise<any> {
        const user = await this.usersRepository.findOne(id);
        user.conversations++;
        await this.usersRepository.save(user);
    }

    async updateIP(id: number, ip: string): Promise<any> {
        const user = await this.usersRepository.findOne(id);
        user.ipAddress = ip;
        await this.usersRepository.save(user);
    }

    // REPORT
    async report(user: User, reportID: number, reportUser: string, messages: object): Promise<any> {
        let reportedUser;
        if (reportUser)
            reportedUser = await this.findByAnon(reportUser);
        else
            reportedUser = await this.findUserById(reportID);

        console.log(messages);
        let msgData = '';
        let imgData = '';
        Object.entries(messages).forEach(([key, val]) => {
            msgData += `${val.from.username} => ${val.to.username} \n`;
            msgData += `${val.text} - ${val.time} \n`;
            imgData += `${val.img}`;
        });
        const report = new Reports()
        report.reporter = user;
        report.user = reportedUser;
        report.messages = msgData;
        report.imgData = imgData;
        report.ipAddress = reportedUser.ipAddress;
        try {
            await report.save();
            return true;
        } catch (Exception) {
            console.log(Exception);
            return false;
        }
    }

}
