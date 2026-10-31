import { user_id } from "@repo/utility/id_types";

export type UserData = {
  name: string;
  email: string;
  image: string;
};

export type UserEntry = {
  id: user_id;
  data: UserData;
};

export type UserRecord = {
  entry: UserEntry;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class User {
  private id: user_id;
  private data: UserData;
  private constructor(id: user_id, data: UserData) {
    this.id = id;
    this.data = data;
  }
  static validName(name: string): boolean {
    return true;
  }
  static validEmail(email: string): boolean {
    return true;
  }
  static validImg(img: string): boolean {
    return true;
  }
  static build(id: user_id, data: UserData) {
    if (!User.validName(data.name)) {
      throw Error("Invalid Name");
    }
    if (!User.validEmail(data.email)) {
      throw Error("Invalid Email");
    }
    if (!User.validImg(data.image)) {
      throw Error("Invalid Image");
    }
    return new User(id, data);
  }
  static fromRecord(record: UserRecord) {
    const data = record.entry.data;
    return User.build(record.entry.id, data);
  }
  public updateName(newName: string): boolean {
    if (User.validName(newName) && this.data.name !== newName) {
      this.data.name = newName;
    }
    return false;
  }
}
