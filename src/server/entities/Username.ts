export class Username {
  private _value!: string;

  public get value() {
    return this._value;
  }

  public static create(value: string) {
    const usernameValue = value.toLowerCase();
    if (!usernameValue.match(/^[a-z][a-z0-9-._]+[a-z0-9]$/g))
      throw new Error("invalid username");
    const username = new Username();
    username._value = usernameValue;
    return username;
  }
}
