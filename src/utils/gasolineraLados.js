export const getLadoLetra = (item) => {
  const lado = item?.lado || item?.lado_id;
  if (lado === "A" || lado === "B") {
    return lado;
  }
  return item?.posicion === "L" ? "B" : "A";
};

export const getLadoLabel = (item) => `LADO ${getLadoLetra(item)}`;

export const ordenarLadosNuevoDiseno = (lados) =>
  [...lados].sort(
    (a, b) => (a.posicion === "L" ? 1 : 0) - (b.posicion === "L" ? 1 : 0),
  );

export const ordenarLadosLegacy = (lados) =>
  [...lados].sort((a, b) => (a.posicion < b.posicion ? -1 : 1));
