export class userItem {
  constructor(
    public userId: string,
    public picture: string,
    public username: string,
    public active: boolean,
    public vip: boolean,
    public email: string,
  ) {}
}
