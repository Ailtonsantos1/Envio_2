import readline from "readline-sync";
import { db } from "../db";
import { uf } from "../schema";

export async function cadastrarUF() {
  const nome = readline.question("Nome da UF: ");
  const sigla = readline.question("Sigla: ");

  await db.insert(uf).values({ nome, sigla });

  console.log("✅ UF cadastrada com sucesso!");
}