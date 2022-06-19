const bcrypt = require("bcryptjs");

const { User } = require("../../models/user");
const signUp = require("./signup");

/* const signUp = require("./auth"); */
/* const authService = require("../services/auth.service"); */

describe("Auth Controller", () => {
  beforeAll(() => {
    console.log("before ALL");
  });

  beforeEach(() => {
    console.log("before Each");
  });

  describe("Register", () => {
    describe("registration", () => {
      it("should throw an Error if User already exists", async () => {
        const spy = jest.spyOn(bcrypt, "hash");

        // mock return User to test situation when it is not a new User
        User.findOne = jest.fn((data) => data);

        await expect(
          async () =>
            await user({
              email: "email",
              password: "password",
              name: "name",
            })
        ).rejects.toThrow("User already exists.");
        expect(spy).toHaveBeenCalledTimes(0);
      });

      it("should create User if it is new User", async () => {
        // mock bcrypt to make test fast and isolated
        bcrypt.hash = jest.fn(() => "bcrypt-hash");

        // mock return null to test situation when User was not found in DB
        User.findOne = jest.fn(() => null);
        User.create = jest.fn((data) => data);

        const result = await user({
          email: "email",
          password: "password",
          name: "name",
          avatarURL: "gravatarURL",
        });

        expect(result).toStrictEqual({
          avatarURL: "gravatarURL",
          email: "email",
          name: "name",
          password: "bcrypt-hash",
        });
        expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      });
    });
    test("New User should register with email", async () => {
      let next = jest.fn();
      authService.user = jest.fn((data) => data);
      const req = {
        body: {
          name: "UserName",
          email: "email@gmail.com",
          password: "qwerty123",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };

      const result = await signUp.register(req, res, next);
      expect(result.code).toBe(201);
      expect(result.data.name).toBe("UserName");
      expect(result.data.email).toBe("email@gmail.com");
      expect(result.data.password).toBeUndefined();
      expect(next).toBeCalledTimes(0);
    });
    test("Old User should not be able to register again", async () => {
      let next = jest.fn();
      authService.user = jest.fn((data) => {
        throw new Error();
      });

      const req = {
        body: {
          name: "UserName",
          email: "email@gmail.com",
          password: "qwerty123",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data),
      };
      await signUp.register(req, res, next);
      expect(next).toBeCalledTimes(1);
    });
  });
});
