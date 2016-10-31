import * as dom from 'dts-dom';

import { IParsingResult, IPropTypes, ExportType } from './index';

export function generateTypings(moduleName: string|null, parsingResult: IParsingResult): string {
  const {exportType, classname, functionname, propTypes} = parsingResult;
  const componentName = classname || functionname || 'Anonymous';

  const m = dom.create.module(moduleName || 'moduleName');
  if (classname) {
    m.members.push(dom.create.importAll('React', 'react'));
  }
  if (propTypes) {
    Object.keys(propTypes).forEach(propName => {
      const prop = propTypes[propName];
      if (prop.importType && prop.importPath) {
        m.members.push(dom.create.importDefault(prop.importType, prop.importPath));
      }
    });
  }
  const interf = createReactPropInterface(componentName, propTypes);
  m.members.push(interf);

  if (classname) {
    m.members.push(createReactClassDeclaration(componentName, exportType, propTypes, interf));
  } else if (functionname) {
    m.members.push(createReactFunctionDeclaration(componentName, exportType, interf));
  }

  if (moduleName === null) {
    return m.members
      .map(member => dom.emit(member, dom.ContextFlags.None))
      .join('');
  } else {
    return dom.emit(m, dom.ContextFlags.Module);
  }
}

function createReactPropInterface(componentName: string, propTypes: IPropTypes): dom.InterfaceDeclaration {
  const interf = dom.create.interface(`${componentName}Props`);
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

function createReactClassDeclaration(componentName: string, exportType: ExportType, propTypes: IPropTypes,
    interf: dom.InterfaceDeclaration): dom.ClassDeclaration {
  const classDecl = dom.create.class(componentName);
  classDecl.baseType = dom.create.interface(`React.Component<${propTypes ? interf.name : 'any'}, any>`);
  classDecl.flags = exportType === ExportType.default ?
    dom.DeclarationFlags.ExportDefault :
    dom.DeclarationFlags.Export;
  return classDecl;
}

function createReactFunctionDeclaration(componentName: string, exportType: ExportType,
    interf: dom.InterfaceDeclaration): dom.FunctionDeclaration {
  const funcDelc = dom.create.function(componentName, [dom.create.parameter('props', interf)],
    dom.create.namedTypeReference('JSX.Element'));
  funcDelc.flags = exportType === ExportType.default ?
    dom.DeclarationFlags.ExportDefault :
    dom.DeclarationFlags.Export;
  return funcDelc;
}
