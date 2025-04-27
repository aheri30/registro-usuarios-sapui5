sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.eliannis.user.users.controller.ViewUsers", {
        onInit() {

            const oView = this.getView(); // Instancia para la vista
            const oUser = new sap.ui.model.json.JSONModel();
            oUser.loadData("./model/user.json"); // Cargar datos de typeDocument.json
            oView.setModel(oUser, "user"); // Asignar modelo con nombre 'typeDocument' a la vista


            // Modelo para 'typeDocument'
            const oTypeDocumentModel = new sap.ui.model.json.JSONModel();
            oTypeDocumentModel.loadData("./model/typeDocument.json"); // Cargar datos de typeDocument.json
            oView.setModel(oTypeDocumentModel, "typeDocument"); // Asignar modelo con nombre 'typeDocument' a la vista

            // Modelo para 'placeOfBirth'
            const oPlaceOfBirthModel = new sap.ui.model.json.JSONModel();
            oPlaceOfBirthModel.loadData("./model/placeBirth.json"); // Cargar datos de placeOfBirth.json
            oView.setModel(oPlaceOfBirthModel, "placeOfBirth"); // Asignar modelo con nombre 'placeOfBirth' a la vista

            // Modelo para 'nationality'
            const oNationalityModel = new sap.ui.model.json.JSONModel();
            oNationalityModel.loadData("./model/nationality.json"); // Cargar datos de nationality.json
            oView.setModel(oNationalityModel, "nationality"); // Asignar modelo con nombre 'nationality' a la vista

            // Modelo para 'gender'
            const oGenderModel = new sap.ui.model.json.JSONModel();
            oGenderModel.loadData("./model/genre.json"); // Cargar datos de genre.json
            oView.setModel(oGenderModel, "gender"); // Asignar modelo con nombre 'gender' a la vista

            // Modelo para 'CivilStatus'
            const oCivilStatusModel = new sap.ui.model.json.JSONModel();
            oCivilStatusModel.loadData("./model/civilStatus.json"); // Cargar datos de civilStatus.json
            oView.setModel(oCivilStatusModel, "civilStatus"); // Asignar modelo con nombre 'civilStatus' a la vista

            // Modelo para 'country'
            const oCountryModel = new sap.ui.model.json.JSONModel();
            oCountryModel.loadData("./model/country.json"); // Cargar datos de country.json
            oView.setModel(oCountryModel, "country"); // Asignar modelo con nombre 'country' a la vista

            const oProvinceModel = new sap.ui.model.json.JSONModel("./model/province.json");
            this.getView().setModel(oProvinceModel, "province");
            // Cargar el modelo de regiones 
            const oRegionModel = new sap.ui.model.json.JSONModel("./model/region.json");
            this.getView().setModel(oRegionModel, "region");
        
        },

        onCountryChange: function (oEvent) {
            const sSelectedCountryKey = oEvent.getSource().getSelectedKey();
            console.log("Selected Country Key: ", sSelectedCountryKey);

            // Limpiar el campo de región
            this.getView().byId("slRegion").setSelectedKey("")
        
            // Obtener el modelo de provincias
            const oProvinceModel = this.getView().getModel("province");
            const aProvinces = oProvinceModel.getProperty("/ProvinceSet");
        
            // Filtrar las provincias por país seleccionado
            const aFilteredProvinces = aProvinces
                .filter(province => province.countryKey === sSelectedCountryKey)
                .map(province => province.provinces) // Acceder al arreglo de provincias
                .flat(); // Aplanar el arreglo
        
            // Actualizar el modelo con las provincias filtradas
            oProvinceModel.setProperty("/filteredProvinces", aFilteredProvinces);
            console.log("Filtered Provinces: ", aFilteredProvinces);
        
            // Limpiar el campo de provincia
            this.getView().byId("slProvince").setSelectedKey("");
        },
        onProvinceChange: function (oEvent) {
            // Obtener las claves seleccionadas de país y provincia
            const sSelectedCountryKey = this.getView().byId("slCountry").getSelectedKey();
            const sSelectedProvinceKey = oEvent.getSource().getSelectedKey();
            console.log("Selected Province Key: ", sSelectedProvinceKey);
            console.log("Selected Country Key: ", sSelectedCountryKey);
        
            // Obtener el modelo de regiones
            const oRegionModel = this.getView().getModel("region");
            const aRegions = oRegionModel.getProperty("/RegionSet");                  
            // Filtrar las regiones por país y provincia
            const aFilteredRegions = aRegions.filter(region =>
                region.countryKey === sSelectedCountryKey &&
                region.provinceKey === sSelectedProvinceKey
            ) .map(region => region.regions) // Acceder al arreglo de provincias
            .flat(); // Aplanar el arreglo;
        
            
          
                // Usar una región por defecto si no hay coincidencias
                const aDefaultRegion = aRegions.filter(region =>
                    region.countryKey === "DEFAULT" && region.provinceKey === "DEFAULT"
                );
            
                const aResultRegions = aFilteredRegions.length > 0
                    ? aFilteredRegions
                    : aDefaultRegion[0].regions;
                
        
            // Actualizar el modelo con las regiones filtradas
            oRegionModel.setProperty("/filteredRegions", aResultRegions);
        
            console.log("Filtered Regions: ", aFilteredRegions);
            }, 
            onClear: function () {
                const oView = this.getView();
            
                // Lista de IDs de los campos del formulario
                const aFieldIds = [
                    "idId",
                    "slDocument",
                    "iNumberD",
                    "iFirstN",
                    "iLastN",
                    "dBirthDate",
                    "slPlaceB",
                    "slNatio",
                    "slGenre",
                    "slCivilS",
                    "slCountry",
                    "slProvince",
                    "slRegion",
                    "iAdress",
                    "iPostalCode",
                    "iPhone",
                    "iEmail"
                ];
            
                // Limpiar los valores de cada campo
                aFieldIds.forEach(function (sFieldId) {
                    const oField = oView.byId(sFieldId);
                    if (oField.setValue) {
                        oField.setValue(""); // Limpiar campo Input o DatePicker
                    } else if (oField.setSelectedKey) {
                        oField.setSelectedKey(""); // Limpiar campo Select
                    }
                });
            
                // Mostrar mensaje de confirmación
                sap.m.MessageToast.show("Todos los campos han sido limpiados.");
            },
            onSave: function () {
                if (this.validateRequiredFields()) {
                    const oView = this.getView();
            
                    const oData = {
                        personalInformation: {
                            id: oView.byId("idId").getValue(),
                            typeDocument: oView.byId("slDocument").getSelectedKey(),
                            numberDocument: oView.byId("iNumberD").getValue(),
                            firstName: oView.byId("iFirstN").getValue(),
                            lastName: oView.byId("iLastN").getValue(),
                            birthDate: oView.byId("dBirthDate").getValue()
                        },
                        otherInformation: {
                            placeBirth: oView.byId("slPlaceB").getSelectedKey(),
                            nationality: oView.byId("slNatio").getSelectedKey(),
                            genre: oView.byId("slGenre").getSelectedKey(),
                            civilStatus: oView.byId("slCivilS").getSelectedKey()
                        },
                        addressInformation: {
                            country: oView.byId("slCountry").getSelectedKey(),
                            province: oView.byId("slProvince").getSelectedKey(),
                            region: oView.byId("slRegion").getSelectedKey(),
                            address: oView.byId("iAdress").getValue(),
                            postalCode: oView.byId("iPostalCode").getValue()
                        },
                        contactInformation: {
                            phoneNumber: oView.byId("iPhone").getValue(),
                            email: oView.byId("iEmail").getValue()
                        }
                    };
            
                    const oModel = oView.getModel("user");
                    let aDataList = oModel.getProperty("/dataList") || [];
                    aDataList.push(oData);
                    oModel.setProperty("/dataList", aDataList);
            
                    sap.m.MessageToast.show("Los datos han sido guardados correctamente.");
                }
            },
            validateRequiredFields: function () {
                const oView = this.getView();
            
                // Lista de IDs de los campos requeridos
                const aRequiredFieldIds = [
                    "idId",         // Input
                    "slDocument",    // Select
                    "iNumberD",      // Input
                    "iFirstN",       // Input
                    "iLastN",        // Input
                    "dBirthDate",    // DatePicker
                    "slPlaceB",      // Select
                    "slNatio",       // Select
                    "slGenre",       // Select
                    "slCivilS",      // Select
                    "slCountry",     // Select
                    "slProvince",    // Select
                    "slRegion",      // Select
                    "iAdress",       // Input
                    "iPostalCode",   // Input
                    "iPhone",        // Input
                    "iEmail"         // Input
                ];
            
                let bIsValid = true; // Bandera para determinar si todos los campos están completos
            
                // Validar todos los campos requeridos
                aRequiredFieldIds.forEach(function (sFieldId) {
                    const oField = oView.byId(sFieldId);
            
                    // Verificar si el campo es un Input o un DatePicker
                    if (oField.getValue) {
                        if (oField.getValue().trim().length === 0) {
                            oField.setValueState("Error"); // Marcar como error visual
                            bIsValid = false;
                        } else {
                            oField.setValueState("None"); // Restablecer estado si está completo
                        }
                    }
                    // Verificar si el campo es un Select
                    else if (oField.getSelectedKey) {
                        if (oField.getSelectedKey().trim().length === 0) {
                            oField.setValueState("Error"); // Marcar como error visual
                            bIsValid = false;
                        } else {
                            oField.setValueState("None"); // Restablecer estado si está completo
                        }
                    }
                });
            
                // Mostrar mensaje si hay errores
                if (!bIsValid) {
                    sap.m.MessageToast.show("Por favor, completa todos los campos requeridos antes de continuar.");
                }
            
                return bIsValid; // Retornar true si todos los campos están validados correctamente
            } });
});