import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Pressable,
} from "react-native";
import React from "react";
import CustomAppBar from "./CustomAppBar";
import SearchCustomer from "./SearchCustomer";
import CustomPicker from "./CustomPicker";
import { TextInput, Tooltip } from "react-native-paper";
import PersonaSVG from "../../assets/images/misc/user.svg";
import SettinsSVG from "../../assets/images/misc/settings.svg";
import CustomCheckBox from "./CustomCheckBox";
import CustomButton from "./CustomButton";
import Ionicons from "react-native-vector-icons/Ionicons";
import { sharedStyles } from "../styles/SharedStyles";

function DispensarModalComponent(props) {
  const {
    setObjHeadBilling,
    valorDispensar,
    tipoDocumento,
    changeValoresDespache,
    searchPersonModal,
    closeModalClientes,
    callCliente,
    isOpenModalHabilitarDispensador,
    renderHabilitarModal,
    selectedSurtidor,
    setTipoDocumento,
    error,
    handleOnSubmitEditing,
    objHeadBilling,
    createChangeHandler,
    openModalHabilitarDispensador,
    setSearchPersonModal,
    selectBoquilla,
    createChangeHandlerPago,
    objPago,
    selectedTarjeta,
    tarjetas,
    valores,
    searchPlaca,
    tipoPago,
    selectedTipo,
    selectedBanco,
    bancos,
    sendEgreso,
    sendFacturacion,
    facturasAnticipadas,
    parametrizacion,
    renderPruebasModal,
    setIsOpenModalPruebasTecnicas,
    isOpenModalPruebasTecnicas,
    permisos,
    establecimientosContables,
    selectedEstablecimientoContable,
    validatePlacaYEstablecimiento,
    setSearchListModal,
    closeModal,
    isloading,
  } = props;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <CustomAppBar
        bold={true}
        titleColor={"#d5a203"}
        center={true}
        leftIcon={
          permisos?.GASOLINERA?.PERMITE_PRUEBAS_TECNICAS &&
          !selectedSurtidor?.proforma?.pruebatecnica
            ? "build-outline"
            : null
        }
        onLeftPress={() => setIsOpenModalPruebasTecnicas(true)}
        rightIcon="close"
        onRightPress={closeModal}
        title={selectedSurtidor ? selectedSurtidor.nombre.toUpperCase() : ""}
      />
      <Modal animationType="slide" visible={searchPersonModal}>
        <SearchCustomer
          actionCloseModal={closeModalClientes}
          actionClick={callCliente}
        />
      </Modal>
      <Modal animationType="slide" visible={isOpenModalPruebasTecnicas}>
        {renderPruebasModal()}
      </Modal>
      <Modal animationType="slide" visible={isOpenModalHabilitarDispensador}>
        {renderHabilitarModal()}
      </Modal>
      <Pressable onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ paddingHorizontal: 5 }}>
            {selectedSurtidor?.proforma &&
              !parametrizacion?.bloquearTipoVenta && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <CustomPicker
                    items={[
                      { label: "FACTURA ELECTRONICA", value: "FAC" },
                      { label: "TICKET DE VENTA", value: "TIK" },
                    ]}
                    selectedValue={tipoDocumento}
                    text={
                      tipoDocumento === "FAC"
                        ? "FACTURA ELECTRONICA"
                        : "TICKET DE VENTA"
                    }
                    onValueChange={setTipoDocumento}
                    dropdownIconColor={"#d5a203"}
                  />
                </View>
              )}
            {!selectedSurtidor?.proforma && (
              <Text style={{ fontSize: 17 }}>Datos de Facturacion:</Text>
            )}
            <View style={styles.placaRow}>
              <TextInput
                style={{ flex: 1 }}
                label="Placa"
                error={error !== ""}
                maxLength={8}
                right={
                  <TextInput.Icon
                    icon="magnify"
                    onPress={() => {
                      handleOnSubmitEditing("placa");
                    }}
                  />
                }
                selectTextOnFocus={true}
                returnKeyType="search"
                autoCapitalize="characters"
                onSubmitEditing={() => handleOnSubmitEditing("placa")}
                mode={"outlined"}
                value={objHeadBilling.placa}
                onBlur={(event) => {
                  validatePlacaYEstablecimiento();
                }}
                onChangeText={(text) => createChangeHandler("placa", text)}
              />
              {objHeadBilling.placas === null ||
                (objHeadBilling.placas?.length <= 1 && (
                  <View style={{ width: 10 }} />
                ))}
              {objHeadBilling.placas === null ||
              objHeadBilling.placas?.length <= 1 ? null : (
                <View style={{ marginLeft: 5 }}>
                  <CustomPicker
                    dropdownIconColor={"#d5a203"}
                    selectedValue={
                      objHeadBilling.placa !== ""
                        ? objHeadBilling.placa
                        : objHeadBilling.placas &&
                          objHeadBilling.placas.length > 0
                        ? objHeadBilling.placas[0]
                        : ""
                    }
                    text={""}
                    onValueChange={(value) => {
                      validatePlacaYEstablecimiento(value);
                      createChangeHandler("placa", value);
                    }}
                    items={((objHeadBilling.placas ?? [])?.length > 0
                      ? typeof objHeadBilling.placas === "string"
                        ? JSON.parse(objHeadBilling.placas)
                        : objHeadBilling.placas
                      : []
                    ).map((campo) => ({
                      label: campo.placa,
                      value: campo.placa,
                    }))}
                  />
                </View>
              )}
              {objHeadBilling.placa !== "" &&
                objHeadBilling.placa !== undefined && (
                  <View style={{ alignItems: "center" }}>
                    <Pressable
                      style={({ pressed }) => ({
                        padding: 5,
                        opacity: pressed ? 0.5 : 1,
                      })}
                      onPress={() => setSearchListModal(true)}
                    >
                      <Ionicons
                        size={30}
                        name="people-circle-outline"
                        color={"#d5a203"}
                      />
                    </Pressable>
                  </View>
                )}
              <View style={{ justifyContent: "center" }}>
                <Pressable
                  style={({ pressed }) => ({
                    paddingHorizontal: 2,
                    opacity: pressed ? 0.5 : 1,
                  })}
                  onPress={() => setSearchPersonModal(true)}
                >
                  <PersonaSVG height={30} width={30} />
                </Pressable>
              </View>
              {selectedSurtidor?.proforma &&
                !selectedSurtidor?.proforma?.pruebatecnica && (
                  <View style={{ justifyContent: "center" }}>
                    <Pressable
                      style={({ pressed }) => ({
                        paddingHorizontal: 2,
                        justifyContent: "center",
                        opacity: pressed ? 0.5 : 1,
                      })}
                      onPress={() => openModalHabilitarDispensador()}
                    >
                      <SettinsSVG height={30} width={30} />
                    </Pressable>
                  </View>
                )}
            </View>
            <View style={styles.container}>
              <TextInput
                style={{ width: "40%" }}
                label="Codigo"
                keyboardType={"numeric"}
                returnKeyType="search"
                right={
                  <TextInput.Icon
                    icon="magnify"
                    onPress={() => {
                      handleOnSubmitEditing("cliente_codigo");
                    }}
                  />
                }
                onSubmitEditing={() => handleOnSubmitEditing("cliente_codigo")}
                mode={"outlined"}
                value={objHeadBilling.cliente_codigo.toString()}
                onChangeText={(text) =>
                  createChangeHandler("cliente_codigo", text)
                }
              />
              <View style={{ width: 5 }} />
              <TextInput
                style={{ flex: 1 }}
                label="RUC"
                returnKeyType="search"
                keyboardType={"numeric"}
                right={
                  <TextInput.Icon
                    icon="magnify"
                    onPress={() => {
                      handleOnSubmitEditing("n_identificacion");
                    }}
                  />
                }
                onSubmitEditing={() =>
                  handleOnSubmitEditing("n_identificacion")
                }
                mode={"outlined"}
                value={objHeadBilling.n_identificacion}
                onChangeText={(text) =>
                  createChangeHandler("n_identificacion", text)
                }
              />
            </View>
            <Pressable
              onPress={() => {
                if (objHeadBilling.nombreCliente !== "") {
                  Alert.alert("Cliente", objHeadBilling.nombreCliente);
                }
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextInput
                  readOnly={true}
                  style={{ flex: 1 }}
                  label="Cliente"
                  mode={"outlined"}
                  value={objHeadBilling.nombreCliente}
                />
              </View>
            </Pressable>
            <View style={styles.container}>
              <TextInput
                style={{ flex: 1 }}
                label="Direccion"
                mode={"outlined"}
                value={objHeadBilling.direccion}
                onChangeText={(text) => createChangeHandler("direccion", text)}
              />
            </View>
            <View style={styles.container}>
              <TextInput
                style={{ flex: 1 }}
                label="Correo"
                keyboardType={"email-address"}
                mode={"outlined"}
                value={objHeadBilling.correo}
                onChangeText={(text) => createChangeHandler("correo", text)}
              />
            </View>
            {!selectedSurtidor?.proforma && (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-around",
                  marginVertical: 7,
                }}
              >
                {(selectedSurtidor?.boquillas ?? []).map((x, index) => {
                  return (
                    <View
                      key={index}
                      style={{ alignItems: "center", marginTop: 5 }}
                    >
                      <Pressable
                        onPress={() => selectBoquilla(x)}
                        style={({ pressed }) => [
                          sharedStyles.boquillasStyle,
                          {
                            backgroundColor: x.color,
                            borderWidth:
                              valorDispensar.boquilla === x.codigo_boquilla
                                ? 3
                                : 0,
                            borderColor:
                              valorDispensar.boquilla === x.codigo_boquilla
                                ? "#000000"
                                : "transparent",
                          },
                          pressed && sharedStyles.pressed,
                        ]}
                      >
                        <Text style={sharedStyles.textBoquilla}>{x.tipo}</Text>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            )}
            <View style={{ height: 10 }} />
            <View style={styles.container}>
              <View style={styles.containerDataSurtidor}>
                <Text>
                  {selectedSurtidor?.proforma > 0
                    ? "Valor Total:"
                    : "Valor en Dolares:"}
                </Text>
                <View
                  style={{
                    width: 160,
                    height: 70,
                    backgroundColor: "#95f995",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                >
                  <TextInput
                    keyboardType={"numeric"}
                    style={styles.input}
                    underlineColor={"transparent"}
                    onChangeText={(value) =>
                      changeValoresDespache("dolares", value, "galones")
                    }
                    readOnly={selectedSurtidor?.proforma}
                    value={
                      selectedSurtidor?.proforma
                        ? valores.dolares.toString()
                        : valorDispensar.dolares.toString()
                    }
                    selectTextOnFocus={true}
                  />
                </View>
              </View>
              <View style={{ width: 10 }} />
              <View style={styles.containerDataSurtidor}>
                <Text>
                  {selectedSurtidor?.proforma
                    ? "Galones:"
                    : "Valor en Galones:"}
                </Text>
                <View
                  style={{
                    width: 160,
                    height: 70,
                    backgroundColor: "#ffb400",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                >
                  <TextInput
                    keyboardType={"numeric"}
                    style={styles.input}
                    underlineColor={"transparent"}
                    onChangeText={(value) =>
                      changeValoresDespache("galones", value, "dolares")
                    }
                    readOnly={selectedSurtidor?.proforma}
                    value={
                      selectedSurtidor?.proforma
                        ? valores.galones.toString()
                        : valorDispensar.galones.toString()
                    }
                    selectTextOnFocus={true}
                  />
                </View>
              </View>
            </View>
            {selectedSurtidor && !selectedSurtidor.proforma && (
              <View style={{ marginTop: 10 }}>
                {objHeadBilling.arrPagosanticipados.length > 0 && (
                  <View>
                    <CustomCheckBox
                      title={"Pago Anticipado"}
                      checked={objHeadBilling.pagoanticipado}
                      onPress={() =>
                        setObjHeadBilling((prev) => ({
                          ...prev,
                          pagoanticipado: !prev.pagoanticipado,
                        }))
                      }
                    />
                    {objHeadBilling.pagoanticipado &&
                      valorDispensar.boquilla !== "" && (
                        <View style={{ alignItems: "flex-start" }}>
                          <Text>Anticipo</Text>
                          <CustomPicker
                            dropdownIconColor={"#d5a203"}
                            selectedValue={objHeadBilling.facturaanticipo_id}
                            onValueChange={(itemValue) =>
                              createChangeHandler(
                                "facturaanticipo_id",
                                itemValue
                              )
                            }
                            text={(() => {
                              const factura = facturasAnticipadas.find(
                                (item) =>
                                  item.id + "," + item.tipo_documento ===
                                  objHeadBilling.facturaanticipo_id
                              );
                              return factura ? factura.total : "";
                            })()}
                            items={facturasAnticipadas.map((item) => ({
                              label: item.total,
                              value: item.id + "," + item.tipo_documento,
                            }))}
                          />
                        </View>
                      )}
                  </View>
                )}
                <CustomButton
                  label={"Habilitar Dispensador"}
                  disabled={isloading}
                  onPress={() => searchPlaca(true)}
                />
              </View>
            )}
            {selectedSurtidor && selectedSurtidor.proforma && (
              <>
                <View style={{ marginTop: 10 }}>
                  <CustomButton
                    label={
                      selectedSurtidor?.proforma?.pruebatecnica
                        ? "Guardar Prueba"
                        : "Guardar Factura"
                    }
                    onPress={() =>
                      selectedSurtidor?.proforma?.pruebatecnica
                        ? sendEgreso()
                        : sendFacturacion()
                    }
                  />
                </View>
              </>
            )}
            {selectedSurtidor &&
              selectedSurtidor.proforma &&
              !selectedSurtidor?.proforma?.pruebatecnica && (
                <>
                  {!objHeadBilling.autoconsumo && (
                    <>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text>Detalle Del Pago:</Text>
                        {objHeadBilling.tipoventa === "CR" && (
                          <Text style={{ fontSize: 13 }}>
                            Cupo credito: ${objHeadBilling.saldoFacturas}
                          </Text>
                        )}
                      </View>

                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <CustomPicker
                          items={tipoPago.map((campo) => ({
                            label: campo.name,
                            value: campo.id,
                          }))}
                          text={
                            selectedTipo?.name
                              ? selectedTipo?.name?.toUpperCase()
                              : "SELECCIONE UN TIPO"
                          }
                          selectedValue={objPago.formapago_id}
                          onValueChange={(value, index) => {
                            createChangeHandlerPago(
                              "formapago_id",
                              value,
                              index
                            );
                          }}
                          dropdownIconColor={"#d5a203"}
                        />
                      </View>
                    </>
                  )}

                  {objHeadBilling.cupocredito > 0 &&
                    !objHeadBilling.permitir_orden_venta && (
                      <>
                        <View>
                          <CustomCheckBox
                            title={"Credito"}
                            checked={objHeadBilling.tipoventa === "CR"}
                            onPress={() =>
                              setObjHeadBilling((prev) => ({
                                ...prev,
                                tipoventa:
                                  prev.tipoventa === "CR" ? "CO" : "CR",
                              }))
                            }
                          />
                        </View>
                      </>
                    )}
                  {objHeadBilling.autoconsumo && (
                    <>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <CustomCheckBox
                          title={"Autoconsumo"}
                          checked={objHeadBilling.autoconsumo}
                        />
                      </View>
                    </>
                  )}
                  {parametrizacion.establecimientoContable &&
                    objHeadBilling.autoconsumo && (
                      <View>
                        <View style={{ flexDirection: "row" }}>
                          <Text>Establecimiento:</Text>
                        </View>
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <CustomPicker
                            text={
                              selectedEstablecimientoContable?.nombreEstablecimiento
                                ? selectedEstablecimientoContable?.nombreEstablecimiento?.toUpperCase()
                                : "SELECCIONE UN BANCO"
                            }
                            dropdownIconColor={"#d5a203"}
                            selectedValue={objPago.establecimiento_contable_id}
                            onValueChange={(itemValue, itemIndex) =>
                              createChangeHandler(
                                "establecimiento_contable_id",
                                itemValue,
                                itemIndex
                              )
                            }
                            items={establecimientosContables.map((item) => ({
                              label: item.nombreEstablecimiento,
                              value: item.id,
                            }))}
                          />
                        </View>
                      </View>
                    )}
                  {objHeadBilling.permitir_orden_venta && (
                    <>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <CustomCheckBox
                          title={"Nota de Entrega"}
                          checked={objHeadBilling.permitir_orden_venta}
                        />
                      </View>
                    </>
                  )}
                  {objPago.abreviatura !== "EFE" &&
                    objPago.abreviatura !== "" && (
                      <>
                        <View>
                          <View style={{ flexDirection: "row" }}>
                            <Text>Banco:</Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <CustomPicker
                              text={
                                selectedBanco?.name
                                  ? selectedBanco?.name?.toUpperCase()
                                  : "SELECCIONE UN BANCO"
                              }
                              dropdownIconColor={"#d5a203"}
                              selectedValue={objPago.banco_id}
                              onValueChange={(itemValue, itemIndex) =>
                                createChangeHandlerPago(
                                  "banco_id",
                                  itemValue,
                                  itemIndex
                                )
                              }
                              items={bancos.map((item) => ({
                                label: item.name,
                                value: item.id,
                              }))}
                            />
                          </View>
                        </View>
                        {objPago.abreviatura !== "TAR" && (
                          <>
                            <View style={{ height: 60 }}>
                              <TextInput
                                style={{ flex: 1 }}
                                label="# Documento"
                                mode={"outlined"}
                                value={objPago.numerodocumentobancario}
                                onChangeText={(text) =>
                                  createChangeHandlerPago(
                                    "numerodocumentobancario",
                                    text
                                  )
                                }
                              />
                            </View>
                          </>
                        )}
                        {objPago.abreviatura === "TAR" && (
                          <>
                            <View>
                              <View style={{ flexDirection: "row" }}>
                                <Text>Tarjeta:</Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <CustomPicker
                                  dropdownIconColor={"#d5a203"}
                                  selectedValue={objPago.tarjeta_id}
                                  text={
                                    selectedTarjeta?.name
                                      ? selectedTarjeta?.name?.toUpperCase()
                                      : "SELECCIONE UNA TARJETA"
                                  }
                                  onValueChange={(itemValue, itemIndex) =>
                                    createChangeHandlerPago(
                                      "tarjeta_id",
                                      itemValue,
                                      itemIndex
                                    )
                                  }
                                  items={tarjetas.map((item) => ({
                                    label: item.name,
                                    value: item.id,
                                  }))}
                                />
                              </View>
                            </View>
                          </>
                        )}
                        <View>
                          {(objPago.abreviatura === "CHE" ||
                            objPago.abreviatura === "OTR") && (
                            <View>
                              <View style={{ height: 60 }}>
                                <TextInput
                                  style={{ flex: 1 }}
                                  label="# Cuenta"
                                  mode={"outlined"}
                                  value={objPago.numerodocumentobancario}
                                  onChangeText={(text) =>
                                    createChangeHandlerPago(
                                      "numerodocumentobancario",
                                      text
                                    )
                                  }
                                />
                              </View>
                            </View>
                          )}
                          {objPago.abreviatura === "TAR" && (
                            <View>
                              <View style={{ height: 60 }}>
                                <TextInput
                                  style={{ flex: 1 }}
                                  label="Voucher"
                                  keyboardType={"numeric"}
                                  mode={"outlined"}
                                  value={objPago.lotevoucher}
                                  onChangeText={(text) =>
                                    createChangeHandlerPago("lotevoucher", text)
                                  }
                                />
                              </View>
                              <View style={{ height: 60 }}>
                                <TextInput
                                  style={{ flex: 1 }}
                                  label="Ref.Voucher"
                                  mode={"outlined"}
                                  keyboardType={"numeric"}
                                  value={objPago.referenciavoucher}
                                  onChangeText={(text) =>
                                    createChangeHandlerPago(
                                      "referenciavoucher",
                                      text
                                    )
                                  }
                                />
                              </View>
                            </View>
                          )}
                        </View>
                      </>
                    )}
                </>
              )}
          </View>
        </ScrollView>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    alignItems: "center",
    fontSize: 30,
    backgroundColor: "transparent",
    borderWidth: 0,
    padding: 0,
    margin: 0,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  placaRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  containerDataSurtidor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default React.memo(DispensarModalComponent);
