import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { DeleteResult } from 'mongoose';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Controller('pokemon')
export class PokemonController {
    constructor(private readonly pokemonService: PokemonService) {}

    @Post()
    create(@Body() createPokemonDto: CreatePokemonDto) {
        return this.pokemonService.create(createPokemonDto);
    }

    @Get()
    findAll() {
        return this.pokemonService.findAll();
    }

    // The term can be the pokemon: no | name | id
    @Get(':term')
    findOne(@Param('term') term: string) {
        return this.pokemonService.findOne(term);
    }

    @Patch(':term')
    update(
        @Param('term') term: string,
        @Body() updatePokemonDto: UpdatePokemonDto,
    ) {
        return this.pokemonService.update(term, updatePokemonDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseMongoIdPipe) id: string): Promise<DeleteResult> {
        return this.pokemonService.remove(id);
    }
}
