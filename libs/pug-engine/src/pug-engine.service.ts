import { Injectable } from '@nestjs/common';
import pug from 'pug';
import { basePathToPugTemplates } from '@libs/constants';
import { BadRequestError } from '@libs/exceptions';

@Injectable()
export class PugEngineService {
  private readonly basedir: string = basePathToPugTemplates;

  readFile(pathToFile: string, variablesToTemplate = {}): string {
    try {
      if (!pathToFile.endsWith('.pug')) {
        pathToFile += '.pug';
      }

      const fullPathToFile = this.basedir + pathToFile;

      const compiledFunction = pug.compileFile(fullPathToFile);

      return compiledFunction(variablesToTemplate);
    } catch (e) {
      const error = [{ field: '', message: e.message }];
      throw new BadRequestError(error);
    }
  }
}
