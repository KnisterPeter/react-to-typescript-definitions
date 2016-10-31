import * as dom from 'dts-dom';

import { IParsingResult, IPropTypes, ExportType } from './index';

export function generateTypings(moduleName: string|null, parsingResult: IParsingResult): string {
  const {exportType, classname, propTypes} = parsingResult;

  const m = dom.create.module(moduleName || 'moduleName');
  m.members.push(dom.create.importAll('React', 'react'));
  if (propTypes) {
    Object.keys(propTypes).forEach(propName => {
      const prop = propTypes[propName];
      if (prop.importType && prop.importPath) {
        m.members.push(dom.create.importDefault(prop.importType, prop.importPath));
      }
    });
  }
  const interf = createReactPropInterface(classname, propTypes);
  m.members.push(interf);

  const classDecl = createReactClassDeclaration(classname, exportType, propTypes, interf);
  m.members.push(classDecl);

  if (moduleName === null) {
    return m.members
      .map(member => dom.emit(member, dom.ContextFlags.None))
      .join('');
  } else {
    return dom.emit(m, dom.ContextFlags.Module);
  }
}

function createReactPropInterface(classname: string, propTypes: IPropTypes): dom.InterfaceDeclaration {
  const interf = dom.create.interface(`${classname}Props`);
  interf.flags = dom.DeclarationFlags.Export;
  Object.keys(propTypes).forEach(propName => {
    const prop = propTypes[propName];

    const property = dom.create.property(propName, prop.type2,
      prop.optional ? dom.DeclarationFlags.Optional : 0);
    if (prop.documentation) {
      property.jsDocComment = prop.documentation
            .split('\n')
            .map(line => line.trim())
            .map(line => line.replace(/^\*\*?/, ''))
            .map(line => line.trim())
            .filter(trimLines())
            .reverse()
            .filter(trimLines())
            .reverse()
            .join('\n');
    }
    interf.members.push(property);
  });
  return interf;
}

function trimLines(): (line: string) => boolean {
  let characterFound = false;
  return (line: string) => (characterFound = Boolean(line)) && Boolean(line);
}

function createReactClassDeclaration(classname: string, exportType: ExportType, propTypes: IPropTypes,
    interf: dom.InterfaceDeclaration): dom.ClassDeclaration {
  const classDecl = dom.create.class(classname);
  classDecl.baseType = dom.create.interface(`React.Component<${propTypes ? interf.name : 'any'}, any>`);
  classDecl.flags = exportType === ExportType.default ?
    dom.DeclarationFlags.ExportDefault :
    dom.DeclarationFlags.Export;
  return classDecl;
}
