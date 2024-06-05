import * as z from "zod";
// export const SettingsSchema = z.object({
//   name: z.optional(z.string()),
//   isTwoFactorEnabled: z.optional(z.boolean()),
//   role: z.enum([UserRole.ADMIN, UserRole.USER]),
//   email: z.optional(z.string().email()),
//   password: z.optional(z.string().min(6)),
//   newPassword: z.optional(z.string().min(6)),
// })
//   .refine((data) => {
//     if (data.password && !data.newPassword) {
//       return false;
//     }

//     return true;
//   }, {
//     message: "New password is required!",
//     path: ["newPassword"]
//   })
//   .refine((data) => {
//     if (data.newPassword && !data.password) {
//       return false;
//     }

//     return true;
//   }, {
//     message: "Password is required!",
//     path: ["password"]
//   })

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema: z.ZodType<LoginForm> = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  //   code: z.optional(z.string()),
});

export const RegisterSchema: z.ZodType<RegisterForm> = z
  .object({
    firstName: z
      .string()
      .min(2, {
        message:
          "First Name is required and must be at least 2 characters long",
      })
      .max(50, {
        message: "First Name is too long. Hmmm is that real",
      }),
    lastName: z
      .string()
      .min(2, {
        message: "Last Name is required and must be at least 2 characters long",
      })
      .max(50, {
        message: "Last Name is too long. Hmmm is that real",
      }),
    email: z.string().email({
      message: "Email is required and must be valid",
    }),
    password1: z
      .string()
      .min(8, "The password must be at least 8 characters long")
      .max(32, "The password must be a maximun 32 characters"),
    //   .regex(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*-])[A- Za-z\d!@#$%&*-]{8,}$/
    //   ),
    password2: z.string(),
  })
  .refine((fields) => fields.password1 === fields.password2, {
    path: ["password2"],
    message: "Passwords don't match",
  });
