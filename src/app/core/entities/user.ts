export class User {
  constructor(
    public name: string,
    public surname: string,
    public email: string,
    public type: string,
    public center?: string,
    public degree?: string,
    public company?: string,
    public position?: string,
    public description?: string
  ) { }
}
