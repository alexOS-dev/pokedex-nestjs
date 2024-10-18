import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
    constructor(
        @InjectModel(Pokemon.name)
        private readonly pokemonModel: Model<Pokemon>,
    ) {}

    async create(createPokemonDto: CreatePokemonDto) {
        createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

        try {
            const pokemon = await this.pokemonModel.create(createPokemonDto);
            return pokemon;
        } catch (error) {
            this.handleExceptions(error);
        }
    }

    findAll() {
        const pokemons = this.pokemonModel.find();

        return pokemons;
    }

    async findOne(term: string) {
        let pokemon: Pokemon;

        // Busca por 'no' (número)
        if (!isNaN(+term)) {
            pokemon = await this.pokemonModel.findOne({ no: term });
        }

        // Si no encontró por número, busca por MongoID
        if (!pokemon && isValidObjectId(term)) {
            pokemon = await this.pokemonModel.findById(term);
        }

        // Si no encontró por MongoID, busca por nombre
        if (!pokemon) {
            pokemon = await this.pokemonModel.findOne({
                name: term.toLowerCase().trim(),
            });
        }

        // Si no encontró por ninguna condición, lanza excepción
        if (!pokemon) {
            throw new NotFoundException(
                `Pokemon with id|name: ${term} not found`,
            );
        }

        return pokemon;
    }

    async update(term: string, updatePokemonDto: UpdatePokemonDto) {
        const pokemon = await this.findOne(term);
        if (updatePokemonDto.name)
            updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

        try {
            await pokemon.updateOne(updatePokemonDto);
            return { ...pokemon.toJSON(), ...updatePokemonDto };
        } catch (error) {
            this.handleExceptions(error);
        }
    }

    async remove(id: string) {
        // const pokemon = await this.findOne(id);

        // await pokemon.deleteOne();
        const result = this.pokemonModel.findByIdAndDelete(id);
        return result;
    }

    private handleExceptions(error: any) {
        if (error.code === 11000) {
            throw new BadRequestException(
                `Pokemon already exists - ${JSON.stringify(error.keyValue)}`,
            );
        }
        console.log(error);
        throw new InternalServerErrorException(
            `Can't create pokemon - Check server logs`,
        );
    }
}
