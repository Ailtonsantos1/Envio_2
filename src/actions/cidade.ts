import readline from "readline-sync";
import { db } from "../db";
import { cidade, uf } from "../schema";

export async function cadastrarCidade() {
  const ufs = await db.select().from(uf);

  if (ufs.length === 0) {
    console.log(" Cadastre uma UF primeiro!");
    return;
  }

  ufs.forEach((u, i) => {
    console.log(`${i + 1} - ${u.nome} (${u.sigla})`);
  });

  const escolha = readline.questionInt("Escolha a UF: ");

  const nome = readline.question("Nome da cidade: ");

  await db.insert(cidade).values({
    nome,
    ufId: ufs[escolha - 1].id,
  });

  console.log(" Cidade cadastrada!");
}