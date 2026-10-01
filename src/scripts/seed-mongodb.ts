import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../utils/MongoDB";
import { AppSetupConfig } from "../models/AppSetup";
import { BcConfig } from "../models/BcConfig";
import { Settings } from "../models/Settings";
import { User } from "../models/User";

type BcSeed = {
  _id: string;
  tenant: string;
  clientId: string;
  clientSecret: string;
  url: string;
  email: string;
  password: string;
  companyId: string;
};

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value.trim();
};

const buildBcConfig = (id: "1" | "2"): BcSeed => ({
  _id: id,
  tenant: requireEnv(`BC_TENANT_${id}`),
  clientId: requireEnv(`BC_CLIENT_ID_${id}`),
  clientSecret: requireEnv(`BC_CLIENT_SECRET_${id}`),
  url: "",
  email: requireEnv(`BC_EMAIL_${id}`),
  password: requireEnv(`BC_PASSWORD_${id}`),
  companyId: (process.env[`BC_COMPANY_ID_${id}`] || "").trim(),
});

const seedData = async () => {
  try {
    await connectDB();
    console.log("Seeding BC configs from .env into MongoDB...");

    const configs = [buildBcConfig("1"), buildBcConfig("2")];

    for (const config of configs) {
      await BcConfig.findByIdAndUpdate(config._id, config, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });
      console.log(
        `✅ BC Config _id=${config._id} upserted (tenant=${config.tenant}, email=${config.email})`
      );
    }

    await AppSetupConfig.findByIdAndUpdate(
      "1",
      {
        _id: "1",
        baseUrl: "",
        defaultCompany: "NTAKE Group",
        ehubUsername: "",
        ehubPassword: "",
        lastModified: "",
        modifiedBy: "",
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
    console.log("✅ App setup _id=1 upserted (defaultCompany=NTAKE Group)");

    await Settings.findByIdAndUpdate(
      "1",
      {
        _id: "1",
        allowCompanyChange: true,
        favicon: null,
        shortcutDimCode1: "COST CENTRE",
        shortcutDimCode2: "REVENUE STREAM",
        themeColor: "#0A58CA",
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
    console.log(
      "✅ Settings _id=1 upserted (theme=#0A58CA, dims=COST CENTRE / REVENUE STREAM)"
    );

    const users = [
      {
        _id: new mongoose.Types.ObjectId("6a7d6f9162beb1bfe2d8e465"),
        email: "jom@hrpsolutions.com",
        password:
          "$2b$10$XPS7KY2vvqz/pAY4vcCFXe9SQOTgl2bBXLA6L31xiz6B61tje2TbC",
        salt: "$2b$10$XPS7KY2vvqz/pAY4vcCFXe",
        verified: false,
        isAdmin: false,
        createdAt: new Date("2026-08-13T07:17:37.838Z"),
        updatedAt: new Date("2026-08-13T07:17:37.838Z"),
      },
      {
        _id: new mongoose.Types.ObjectId("6a7d70fa62beb1bfe2d8e48e"),
        email: "jom@hrpsolutios.com",
        password:
          "$2b$10$qb0fJU7pEdZ.7lJ/pIKylem4.n1Fz3RIqizjclDRtTy9pqSCN6mkG",
        salt: "$2b$10$qb0fJU7pEdZ.7lJ/pIKyle",
        verified: false,
        isAdmin: false,
        createdAt: new Date("2026-08-13T07:23:38.934Z"),
        updatedAt: new Date("2026-08-13T07:23:38.934Z"),
      },
      {
        _id: new mongoose.Types.ObjectId("6a7e9ee29d92d95a76d40bfe"),
        email: "lin@hrpsolutions.com",
        password:
          "$2b$10$k/b1rkgKSGrpku7u0/eZve.Vk5mGpPOJvSk9ifHYJwRW3IohLvMWe",
        salt: "$2b$10$k/b1rkgKSGrpku7u0/eZve",
        verified: false,
        isAdmin: false,
        createdAt: new Date("2026-08-14T04:51:46.869Z"),
        updatedAt: new Date("2026-08-14T04:51:46.869Z"),
      },
    ];

    for (const user of users) {
      await User.findByIdAndUpdate(user._id, user, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        timestamps: false,
      });
      console.log(`✅ User upserted (${user.email})`);
    }

    console.log("🎉 Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
};

seedData();
