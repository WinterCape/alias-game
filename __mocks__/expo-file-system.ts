export const Paths = { cache: 'file:///cache/' };
export class File {
  uri: string;
  exists = false;
  constructor(dir: string, name: string) {
    this.uri = `${dir}${name}`;
  }
  create = jest.fn();
  write = jest.fn();
}
