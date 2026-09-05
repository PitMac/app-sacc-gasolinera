import { useCallback, useEffect, useState } from "react";
import {
  isDevBuild,
  isDesarrolloSinComandos,
  loadModoProduccionDev,
  saveModoProduccionDev,
} from "../utils/gasolineraComandos";

export function useGasolineraComandos() {
  const [modoProduccion, setModoProduccion] = useState(!isDevBuild);

  useEffect(() => {
    if (!isDevBuild) {
      return;
    }
    loadModoProduccionDev().then(setModoProduccion);
  }, []);

  const isDesarrollo = isDesarrolloSinComandos(isDevBuild, modoProduccion);

  const toggleModoProduccion = useCallback(async () => {
    const next = !modoProduccion;
    await saveModoProduccionDev(next);
    setModoProduccion(next);
  }, [modoProduccion]);

  return {
    isDevBuild,
    isDesarrollo,
    enviarComandos: !isDesarrollo,
    modoProduccion,
    toggleModoProduccion,
  };
}
