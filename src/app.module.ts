import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';

@Module({
    imports: [
        ConfigModule.forRoot(),

        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
        }),
        PokemonModule,
        MongooseModule.forRoot('mongodb://localhost:27017/nest-pokedex'),
        CommonModule,
        SeedModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
    constructor() {
        console.log(process.env);
    }
}
