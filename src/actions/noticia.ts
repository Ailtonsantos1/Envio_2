import readline from "readline-sync";
import { db } from "../db";
import { noticia, cidade, uf } from "../schema";
import { asc, desc, eq } from "drizzle-orm";

//  CADASTRAR NOTÍCIA
export async function cadastrarNoticia() {
  const cidades = await db.select().from(cidade);

  if (cidades.length === 0) {
    console.log(" Cadastre uma cidade primeiro!");
    return;
  }

  const titulo = readline.question("Título: ");
  const texto = readline.question("Texto: ");

  console.log("\nEscolha a cidade:");
  cidades.forEach((c, i) => {
    console.log(`${i + 1} - ${c.nome}`);
  });

  const escolha = readline.questionInt("Número: ");

  await db.insert(noticia).values({
    titulo,
    texto,
    cidadeId: cidades[escolha - 1].id,
    dataCriacao: new Date(), 
  });

  console.log(" Notícia cadastrada!");
}

//  LISTAR NOTÍCIAS (ORDENADAS)
export async function listarNoticias(ordem: "asc" | "desc") {
  const lista = await db
    .select()
    .from(noticia)
    .innerJoin(cidade, eq(noticia.cidadeId, cidade.id))
    .innerJoin(uf, eq(cidade.ufId, uf.id))
    .orderBy(
      ordem === "desc"
        ? desc(noticia.dataCriacao)
        : asc(noticia.dataCriacao)
    );

  if (lista.length === 0) {
    console.log("Nenhuma notícia cadastrada.");
    return;
  }

  lista.forEach((item, i) => {
    console.log("=".repeat(50));
    console.log(` ${i + 1} - ${item.noticia.titulo}`);
    console.log("\n Texto:");
    console.log(item.noticia.texto);
    console.log(`\n📍 Cidade: ${item.cidade.nome} - ${item.uf.sigla}`);
    console.log(
      ` Data: ${new Date(item.noticia.dataCriacao).toLocaleString()}`
    );
    console.log("=".repeat(50));
  });
}

//  NOTÍCIAS POR ESTADO
export async function noticiasPorEstado() {
  const ufs = await db.select().from(uf);

  if (ufs.length === 0) {
    console.log(" Cadastre uma UF primeiro!");
    return;
  }

  console.log("\nEscolha o estado:");
  ufs.forEach((u, i) => {
    console.log(`${i + 1} - ${u.nome}`);
  });

  const escolha = readline.questionInt("Número: ");
  const estado = ufs[escolha - 1];

  const resultado = await db
    .select()
    .from(noticia)
    .innerJoin(cidade, eq(noticia.cidadeId, cidade.id))
    .where(eq(cidade.ufId, estado.id));

  if (resultado.length === 0) {
    console.log("Nenhuma notícia encontrada.");
    return;
  }

  resultado.forEach((r, i) => {
    console.log(`${i + 1} - ${r.noticia.titulo}`);
  });
}

//  AGRUPAR POR ESTADO
export async function agruparNoticias() {
  const estados = await db.select().from(uf);

  let contador = 1;

  for (const estado of estados) {
    console.log(`\n ${estado.sigla}`);

    const resultado = await db
      .select()
      .from(noticia)
      .innerJoin(cidade, eq(noticia.cidadeId, cidade.id))
      .where(eq(cidade.ufId, estado.id));

    if (resultado.length === 0) {
      console.log("  (sem notícias)");
      continue;
    }

    resultado.forEach((r) => {
      console.log(`${contador++} - ${r.noticia.titulo} (${r.cidade.nome})`);
    });
  }
}