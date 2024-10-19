import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';

import type { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

@Injectable()
export class SeedService {
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>;

    private readonly axios: AxiosInstance = axios;

    async executeSeed() {
        const { data } = await this.axios.get<PokeResponse>(
            'https://pokeapi.co/api/v2/pokemon?limit=650',
        );

        data.results.forEach(async ({ name, url }) => {
            const segments = url.split('/');
            const no: number = +segments[segments.length - 2];

            const pokemon = await this.pokemonModel.create({ name, no });
        });

        return 'Seed executed';
    }
}
