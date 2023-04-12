import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpStatus,
  NotFoundException,
  BadGatewayException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article as ArticleModel } from '@prisma/client';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  //Get all articles
  @Get()
  getArticles(): Promise<ArticleModel[]> {
    try {
      return this.articleService.findAllArticles();
    } catch (err) {
      throw new NotFoundException();
    }
  }

  //Get article by id
  @Get(':id')
  getOneArticle(@Param('id') id: string): Promise<ArticleModel> {
    try {
      return this.articleService.findArticleById(Number(id));
    } catch (err) {
      throw new NotFoundException();
    }
  }

  //Create article
  @Post()
  postArticle(@Body() createArticleDto: CreateArticleDto): string {
    try {
      this.articleService.createArticle(createArticleDto);
      return `Status code: ${HttpStatus.ACCEPTED}. Successfully added new article!`;
    } catch (err) {
      throw new BadGatewayException();
    }
  }

  //Update article
  @Put(':id')
  updateArticle(
    @Param('id') id: number,
    @Body('content') content: string,
  ): string {
    console.log(id);
    try {
      this.articleService.updateArt({
        where: { id: Number(id) },
        data: { content: content },
      });

      return `Status code: ${HttpStatus.ACCEPTED}. Successfully updated the article with ID:${id}`;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  //Delete article
  @Delete(':id')
  deleteArticle(@Param('id') id: string) {
    try {
      this.articleService.deleteArticle({ id: Number(id) });
      return `Status code: ${HttpStatus.ACCEPTED}. Successfully deleted the article with ${id}`;
    } catch (err) {
      throw new NotFoundException();
    }
  }
}
