/*import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'*/
import conexion from '../database/connection.js'

// Rellenar select
// ======================================================================================================================
export const selectMunicipios = async (req, res) => {
    conexion.query("SELECT * FROM municipios",function(err,datos){
        if (err) {
            console.log("No se pudieron cargar los municipios")
            return
        } else {
            res.render('./actions/agregarCliente', {datosMunicipio:datos})
        }
    }) 
}

export const selectDepartamentos = async (req, res) => {
    conexion.query("SELECT * FROM departamentos",function(err,datos){
        if (err) {
            console.log("No se pudieron cargar los departamentos")
            return
        } else {
            res.render('./actions/agregarMunicipio', {datosDepartamento:datos})
        }
    }) 
}

// Rellenar tablas
// ======================================================================================================================
export const departamentos = async (req, res) => {
    conexion.query("SELECT * FROM departamentos",function(err,datos){
        if (err) {
            console.log("No se pudieron cargar los departamentos")
            return
        }
        else{
            res.render('adminDepartamentos', {datosDepartamento:datos})
        }
    }) 
}

export const municipios = async (req, res) => {
    conexion.query(`SELECT municipios.idMunicipio, municipios.nombreMunicipio, departamentos.nombreDepartamento 
    FROM municipios INNER JOIN departamentos ON municipios.departamento=departamentos.idDepartamento`,function(err,datos){
        if (err) {
            console.log("No se pudieron cargar los municipios")
        }
        else{
            res.render('adminMunicipios', {datosMunicipio:datos})
        }
    }) 
}

export const clientes = async (req, res) => {
    conexion.query(`SELECT municipios.nombreMunicipio, clientes.idCliente, clientes.identidad, clientes.telefono, clientes.email,
    CONCAT(clientes.primerNombreCliente, " ", clientes.primerApellidoCliente) nombreCliente
    FROM municipios INNER JOIN clientes ON municipios.idMunicipio=clientes.municipio`,function(err,datos){
        if (err) {
            console.log("Ocurrio un error al cargar los clientes")
            return
        }
        else{
            res.render('adminClientes', {datosCliente:datos})
        }
    }) 
}

// Inserción en bd
// ======================================================================================================================
export const agregarDepartamento = async(req,res) => {
    const {nombreDepartamento} = req.body

    //construccion del query
    conexion.query("INSERT INTO departamentos (nombreDepartamento) VALUES(?);",nombreDepartamento,(err, result) =>{
        if (err) {
            console.log('Ocurrio un error al agregar el departamento')
            return
        }

        res.redirect('adminDepartamentos')
    })
}

export const agregarMunicipio = async(req,res) => {
    const {nombreMunicipio, idDepartamento} = req.body

    //construccion del query
    conexion.query("INSERT INTO municipios (nombreMunicipio, departamento) VALUES(?, ?);", [nombreMunicipio, idDepartamento],(err, result) =>{
        if (err) {
            console.log('Ocurrio un error al agregar el municipio')
            return
        }

        res.redirect('adminMunicipios')
    })

}

export const agregarCliente = async(req,res) => {
    const {nombreCliente, apellidoCliente, emailCliente, identidadCliente, telefonoCliente, direccionCliente, idMunicipio} = req.body

    //construccion del query
    // Verificar si el numero de identidad ya existe
    conexion.query("SELECT * FROM clientes WHERE identidad=?",[identidadCliente],function(err, result){
        if (err) {
            console.log("Ocurrio un error al verificar la existencia de la identidad")
        }
        if (result.length == 0) {
            conexion.query(`INSERT INTO clientes
            (primerNombreCliente, primerApellidoCliente, email, telefono, identidad, direccion, municipio)
            VALUES(?, ?, ?, ?, ?, ?, ?);`,[nombreCliente,apellidoCliente,emailCliente,telefonoCliente,identidadCliente,direccionCliente,idMunicipio],(err) =>{
                if (err) {
                    console.log('Ocurrio un error al agregar el cliente')
                    return
                }

                res.redirect('adminClientes')
            })
        }
        else{
            console.log("Este numero de identidad ya existe")
            return
        }
    })
}

// Cargar formularios
// ======================================================================================================================
export const cargarEditarDepartamento = async (req, res) => {
    conexion.query("SELECT * FROM departamentos WHERE idDepartamento=?",req.params.idDepartamento,function(err,datos){
        if (err) {
            console.log("Ocurrio un error al buscar el departamento")
            return
        }
        else{
            res.render('./actions/editarDepartamento', {datosDepartamento:datos})
        }
        
    })
}

export const cargarEditarMunicipio = async (req, res) => {
    conexion.query(`SELECT municipios.idMunicipio, municipios.nombreMunicipio, municipios.departamento, departamentos.nombreDepartamento 
    FROM municipios INNER JOIN departamentos ON municipios.departamento=departamentos.idDepartamento WHERE municipios.idMunicipio = ?`,req.params.idMunicipio,function(err,datos){
        if (err) {
            console.log("Ocurrio un error al buscar el municipio")
            return
        }
        else{
            conexion.query("SELECT * FROM departamentos",function(err,seleDepto){
                if (err) {
                    console.log("Ocurrio un error al buscar departamentos para rellenar select")
                } else {
                    res.render('./actions/editarMunicipio', {datosMunicipio:datos, datosDepartamento:seleDepto})
                }
            })
        }
    })
}

export const cargarEditarCliente = async (req, res) => {
    conexion.query(`SELECT municipios.nombreMunicipio, clientes.municipio, clientes.idCliente, clientes.identidad, clientes.telefono, clientes.email,
    clientes.primerNombreCliente, clientes.primerApellidoCliente, clientes.direccion
    FROM municipios INNER JOIN clientes ON municipios.idMunicipio=clientes.municipio WHERE clientes.idCliente=?`,req.params.idCliente,function(err,datos){
        if (err) {
            console.log("Ocurrio un error al buscar el cliente")
            return
        }
        else{
            conexion.query("SELECT * FROM municipios",function(err,seleMuni){
                if (err) {
                    console.log("Ocurrio un error al buscar municipios para rellenar select")
                } else {
                    res.render('./actions/editarCliente', {datosCliente:datos, datosMunicipio:seleMuni})
                }
            })
        }
    })
}

// Editar datos
// ======================================================================================================================
export const editardepartamento = async (req, res) => {
    const {idDepartamento, nombreDepartamento} = req.body

    //construccion del query
    conexion.query("UPDATE departamentos SET nombreDepartamento=? WHERE idDepartamento=?;", [nombreDepartamento, idDepartamento],(err, result) =>{
        if (err) {
            console.log('Ocurrio un error al editar el departamento')
            return
        }

        res.redirect('../adminDepartamentos')
    })
}

export const editarMunicipio = async (req, res) => {
    const {idDepartamento, idMunicipio, nombreMunicipio} = req.body

    //construccion del query
    conexion.query("UPDATE municipios SET nombreMunicipio=?, departamento=? WHERE idMunicipio=?;", [nombreMunicipio, idDepartamento, idMunicipio],(err, result) =>{
        if (err) {
            console.log('Ocurrio un error al editar el municipio')
            return
        }

        res.redirect('../adminMunicipios')
    })
}

export const editarCliente = async (req, res) => {
    const {idCliente, nombreCliente, apellidoCliente, emailCliente, identidadCliente, telefonoCliente, direccionCliente, idMunicipio} = req.body
    
    //construccion del query
    conexion.query(`UPDATE clientes
    SET primerNombreCliente=?, primerApellidoCliente=?, email=?, telefono=?, identidad=?, direccion=?, municipio=?
    WHERE idCliente=?;`, [nombreCliente,apellidoCliente,emailCliente,telefonoCliente,identidadCliente,direccionCliente,idMunicipio,idCliente],(err, result) =>{
        if (err) {
            console.log('Ocurrio un error al editar el cliente')
            return
        }

        res.redirect('../adminClientes')
    })
}

// Eliminar datos
// ======================================================================================================================
export const eliminarDepartamento = async (req, res) => {
    conexion.query("SELECT * FROM departamentos WHERE idDepartamento=?",req.params.idDepartamento,function(err){
        if (err) {
            console.log('No se encontro el departamento')
            return
        }
        else{
            conexion.query("DELETE FROM departamentos WHERE idDepartamento=?;",req.params.idDepartamento, function(err){
                if(err){
                    console.log('Ocurrio un error al eliminar el departamento')
                    return
                }
            })
        }
    })
    res.redirect('../adminDepartamentos')
}

export const eliminarMunicipio = async (req, res) => {
    conexion.query("SELECT * FROM municipios WHERE idMunicipio=?",req.params.idMunicipio,function(err){
        if (err) {
            console.log('No se encontro el municipio')
            return
        }
        else{
            conexion.query("DELETE FROM municipios WHERE idMunicipio=?;",req.params.idMunicipio, function(err){
                if(err){
                    console.log('Ocurrio un error al eliminar el municipio')
                    return
                }
            })
        }
    })
    res.redirect('../adminMunicipios')
}

export const eliminarCliente = async (req, res) => {
    conexion.query("SELECT * FROM clientes WHERE idCliente=?",req.params.idCliente,function(err){
        if (err) {
            console.log('No se encontro el cliente')
            return
        }
        else{
            conexion.query("DELETE FROM clientes WHERE idCliente=?;",req.params.idCliente, function(err){
                if(err){
                    console.log('Ocurrio un error al eliminar el cliente')
                    return
                }
            })
        }
    })
    res.redirect('../adminClientes')
}