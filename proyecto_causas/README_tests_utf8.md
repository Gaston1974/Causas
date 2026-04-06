__LOGIN__

http POST [http://127\.0\.0\.1:8080/v1/login](http://127.0.0.1:8080/v1/login) 

__Content\-Type__:application/json < data\_login\.json

__ALTAS__

  

http POST [http://127\.0\.0\.1:8080/v1/altas](http://127.0.0.1:8080/v1/altas) 

__Authorization__: \( aca va el numero de autorizacion que devuelve el login en el campo __Authorization__ del header \)

__Content\-Type__:application/json < data\_altaCausa\.json  // data\_altaUsuario\.json //   data\_altaPreventor\.json  //  data\_altaFiscalia\.json

// data\_altaJuzgado\.json

__BAJAS__ 

http POST [http://127\.0\.0\.1:8080/v1/bajas](http://127.0.0.1:8080/v1/bajas) 

__Authorization__: 

__Content\-Type__:application/json < data\_bajaCausa\.json   //  data\_bajaUsuario\.json //  data\_bajaPreventor\.json //  data\_bajaJuzgado\.json //  

data\_bajaFiscallia\.json

__CONSULTAS__

http POST [http://127\.0\.0\.1:8080/v1/causas](http://127.0.0.1:8080/v1/causas)     // Devuelve todas las causas

__Authorization__: 

http POST [http://127\.0\.0\.1:8080/v1/usuarios](http://127.0.0.1:8080/v1/usuarios)   // Devuelve todos los usuarios

__Authorization__: 

http POST [http://127\.0\.0\.1:8080/v1/usuarios](http://127.0.0.1:8080/v1/usuarios) 

__Authorization__:

__Content\-Type__:application/json < data\_consultaUsuario\.json

http POST [http://127\.0\.0\.1:8080/v1/causas](http://127.0.0.1:8080/v1/causas) 

__Authorization__: 

__Content\-Type__:application/json < data\_consultaCausas\.json

http POST [http://127\.0\.0\.1:8080/v1/causas/historico](http://127.0.0.1:8080/v1/causas/historico)  // devuelve el historico de una causa

__Authorization__: 

__Content\-Type__:application/json < data\_consultaHistorico\.json

http GET [http://127\.0\.0\.1:8080/v1/combos/provincias](http://127.0.0.1:8080/v1/combos/provincias)

__Authorization__: 

http GET [http://127\.0\.0\.1:8080/v1/combos/localidades](http://127.0.0.1:8080/v1/combos/localidades)

__Authorization__: 

http GET [http://127\.0\.0\.1:8080/v1/combos/fiscalias](http://127.0.0.1:8080/v1/combos/fiscalias)

__Authorization__: 

http GET [http://127\.0\.0\.1:8080/v1/combos/juzgados](http://127.0.0.1:8080/v1/combos/juzgados)

__Authorization__: 

http GET [http://127\.0\.0\.1:8080/v1/combos/p](http://127.0.0.1:8080/v1/combos/juzgados)reventores

__Authorization__: 

__ACTUALIZACION__

http POST [http://127\.0\.0\.1:8080/v1/updates](http://127.0.0.1:8080/v1/updates) 

__Authorization__:

__Content\-Type__:application/json < data\_updateUsuario\.json

                 http POST [http://127\.0\.0\.1:8080/v1/updates](http://127.0.0.1:8080/v1/updates) 

					  	__Authorization__:

 	__Content\-Type__:application/json < data\_updateCausa\.json

