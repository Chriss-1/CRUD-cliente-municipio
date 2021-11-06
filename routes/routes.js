import express from 'express'
import {departamentos, agregarDepartamento, cargarEditarDepartamento, editardepartamento, eliminarDepartamento,
        municipios, agregarMunicipio, cargarEditarMunicipio, editarMunicipio, eliminarMunicipio, 
        clientes, agregarCliente, editarCliente, eliminarCliente, cargarEditarCliente, selectDepartamentos, selectMunicipios, } from '../controllers/authController.js'
const router = express.Router()

// rutas para las vistas
// ===================================================================================================
router.get('/', (req, res) => { 
    res.render('index',)
})

// Departamento
router.get('/adminDepartamentos', departamentos)
router.get('/editarDepartamento/:idDepartamento', cargarEditarDepartamento)

// Municipio
router.get('/adminMunicipios', municipios)
router.get('/editarMunicipio/:idMunicipio', cargarEditarMunicipio)

// Cliente
router.get('/adminClientes', clientes)
router.get('/editarCliente/:idCliente', cargarEditarCliente)


// rutas para las acciones
// ===================================================================================================
router.get('/agregarDepartamento', (req, res) => { 
    res.render('./actions/agregarDepartamento')
})

router.get('/agregarMunicipio', selectDepartamentos)

router.get('/agregarCliente', selectMunicipios)



// rutas para los controllers
// ===================================================================================================
// Departamento
router.post('/agregarDepartamento', agregarDepartamento)
router.post('/editarDepartamento/editarDepartamento', editardepartamento)
router.post('/eliminarDepartamento/:idDepartamento', eliminarDepartamento)

// Municipio
router.post('/agregarMunicipio', agregarMunicipio)
router.post('/editarMunicipio/editarMunicipio', editarMunicipio)
router.post('/eliminarMunicipio/:idMunicipio', eliminarMunicipio)

// Cliente
router.post('/agregarCliente', agregarCliente)
router.post('/editarCliente/editarCliente', editarCliente)
router.post('/eliminarCliente/:idCliente', eliminarCliente)

export default router