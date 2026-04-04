import readline from "readline-sync";
import { db } from "../db";
import { noticia, cidade, uf } from "../schema";
import { asc, desc, eq } from "drizzle-orm";

export async function cadastrarNoticia() {
  const cidades = await db.select().from(cidade);

  if (cidades.length === 0) {
    console.log("⚠️ Cadastre uma cidade primeiro!");
    return;
  }

  const titulo = readline.question("Título: ");
  const texto = readline.question("Texto: ");

  cidades.forEach((c, i) => {
    console.log(`${i + 1} - ${c.nome}`);
  });

  const escolha = readline.questionInt("Escolha a cidade: ");

  await db.insert(noticia).values({
    titulo,
    texto,
    cidadeId: cidades[escolha - 1].id,
    dataCriacao: new Date().toISOString(),
  });

  console.log("✅ Notícia cadastrada!");
}

export async function listarNoticias(ordem: "asc" | "desc") {
  const lista = await db
    .select()
    .from(noticia)
    .innerJoin(cidade, eq(noticia.cidadeId, cidade.id))
    .innerJoin(uf, eq(cidade.ufId, uf.id))
    .orderBy(ordem === "desc" ? desc(noticia.dataCriacao) : asc(noticia.dataCriacao));

  if (lista.length === 0) {
    console.log("Nenhuma notícia cadastrada.");
    return;
  }

  lista.forEach((item, i) => {
    console.log(`
==============================
${i + 1} - ${item.noticia.titulo}

${item.noticia.texto}

Cidade: ${item.cidade.nome} - ${item.uf.sigla}
Data: ${item.noticia.dataCriacao}
==============================
`);
  });
}

export async function noticiasPorEstado() {
  const ufs = await db.select().from(uf);

  if (ufs.length === 0) {
    console.log("⚠️ Cadastre uma UF primeiro!");
    return;
  }

  ufs.forEach((u, i) => {
    console.log(`${i + 1} - ${u.nome}`);
  });

  const escolha = readline.questionInt("Escolha o estado: ");

  const estado = ufs[escolha - 1];

  const resultado = await db
    .select()
    .from(noticia)
    .innerJoin(cidade, eq(noticia.cidadeId, cidade.id))
    .where(eq(cidade.ufId, estado.id));

  resultado.forEach((r, i) => {
    console.log(`${i + 1} - ${r.noticia.titulo}`);
  });
}

export async function agruparNoticias() {
  const estados = await db.select().from(uf);

  let contador = 1;

  for (const estado of estados) {
    console.log(`\n# ${estado.sigla}`);

    const resultado = await db
      .select()
      .from(noticia)
      .innerJoin(cidade, eq(noticia.cidadeId, cidade.id))
      .where(eq(cidade.ufId, estado.id));

    resultado.forEach((r) => {
      console.log(`${contador++} - ${r.noticia.titulo} - ${r.cidade.nome}`);
    });
  }
}