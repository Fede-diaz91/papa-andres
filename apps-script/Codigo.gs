// ============================================================
// PAPÁ ANDRÉS — GESTIÓN INTEGRAL 2026
// Backend API para Netlify frontend
// ============================================================

var SS_ID = '1pinsOZtF70BSbtpWAv-RBK2NEeXmqA7MQId1_Vl4WEk';

function getSpreadsheet() {
  return SpreadsheetApp.openById(SS_ID);
}

// ============================================================
// ROUTER — maneja todos los requests
// ============================================================
function doGet(e) {
  var action = e && e.parameter ? e.parameter.action : '';
  var mes    = e && e.parameter ? e.parameter.mes    : '';
  var anio   = e && e.parameter ? e.parameter.anio   : '';
  var data   = {};
  try { if (e && e.parameter && e.parameter.data) data = JSON.parse(e.parameter.data); } catch(ex) {}

  try {
    var result;
    if      (action === 'dashboard')        result = getDashboardData(parseInt(mes)||new Date().getMonth()+1, parseInt(anio)||new Date().getFullYear());
    else if (action === 'estadoResultados') result = getEstadoResultados(parseInt(anio)||new Date().getFullYear());
    else if (action === 'ventasMes')        result = getVentasMesCompleto(mes, anio);
    else if (action === 'ventasExportar')   result = getVentasParaExportar(mes, anio);
    else if (action === 'proveedores')      result = getProveedores();
    else if (action === 'plataformas')      result = getPlataformas();
    else if (action === 'compras')          result = _getFiltered('Compras', mes, anio);
    else if (action === 'gastosFijos')      result = _getFiltered('GastosFijos', mes, anio);
    else if (action === 'gastosVariables')  result = _getFiltered('GastosVariables', mes, anio);
    else if (action === 'envios')           result = _getFiltered('Envíos', mes, anio);
    else if (action === 'bienesDeUso')      result = _getFiltered('BienesDeUso', mes, anio);
    else if (action === 'alquiler')         result = _getFiltered('Alquiler', mes, anio);
    else if (action === 'resumenMensual')   result = getResumenMensual(parseInt(mes), parseInt(anio));
    else if (action === 'ventasHistorialDia')       result = getVentasHistorial('DatosDia', mes, anio);
    else if (action === 'ventasHistorialProductos') result = getVentasHistorial('DatosProductos', mes, anio);
    else if (action === 'empleados')        result = getEmpleados(false);
    else if (action === 'salarios')         result = _getFiltered('Salarios', mes, anio);
    else if (action === 'retiros')          result = _getFiltered('Retiros', mes, anio);
    else if (action === 'productos')        result = getProductos();
    else if (action === 'analisisMarginal') result = getAnalisisMarginal();
    else if (action === 'preciosUltCompra') result = getPreciosUltimaCompra();
    else if (action === 'preciosBase')      result = getPreciosBase();
    else if (action === 'insumos')          result = getInsumos();
    else if (action === 'subrecetas')       result = getSubrecetasCompleto();
    else if (action === 'parametrosVenta')  result = getParametrosVenta();
    else result = { ok: true, msg: 'Papá Andrés API v2.3' };

    return _json(result);
  } catch(err) {
    return _json({ error: err.message });
  }
}

function doPost(e) {
  try {
    var body   = JSON.parse(e.postData.contents);
    var action = body.action;
    var data   = body.data || {};
    var result;

    if      (action === 'importarVentasDia')       result = importarVentasDia(data.mes, data.filas, data.anio);
    else if (action === 'importarVentasProductos') result = importarVentasProductos(data.mes, data.filas, data.anio);
    else if (action === 'borrarVentasMes')         result = borrarVentasMes(data.mes, data.incluirManual, data.anio);
    else if (action === 'prepararVentas')          result = prepararVentas();
    else if (action === 'borrarVentas')            result = borrarVentas(data);
    else if (action === 'registrarVentaManual')    result = registrarVentaManual(data);
    else if (action === 'registrarCompra')         result = registrarCompra(data);
    else if (action === 'registrarGastoFijo')      result = registrarGastoFijo(data);
    else if (action === 'registrarGastoVariable')  result = registrarGastoVariable(data);
    else if (action === 'registrarEnvio')          result = registrarEnvio(data);
    else if (action === 'registrarBienDeUso')      result = registrarBienDeUso(data);
    else if (action === 'registrarAlquiler')       result = registrarAlquiler(data);
    else if (action === 'registrarSalario')        result = registrarSalario(data);
    else if (action === 'registrarRetiro')         result = registrarRetiro(data);
    else if (action === 'eliminarSalario')         result = eliminarFila('Salarios', data.rowIndex);
    else if (action === 'eliminarRetiro')          result = eliminarFila('Retiros', data.rowIndex);
    else if (action === 'agregarProveedor')        result = agregarProveedor(data);
    else if (action === 'eliminarProveedor')       result = eliminarProveedor(data);
    else if (action === 'agregarPlataforma')       result = agregarPlataforma(data);
    else if (action === 'eliminarPlataforma')      result = eliminarPlataforma(data.id);
    else if (action === 'eliminarCompra')          result = eliminarCompra(data);
    else if (action === 'eliminarGastoFijo')       result = eliminarFila('GastosFijos', data.rowIndex);
    else if (action === 'eliminarGastoVariable')   result = eliminarFila('GastosVariables', data.rowIndex);
    else if (action === 'eliminarEnvio')           result = eliminarFila('Envíos', data.rowIndex);
    else if (action === 'eliminarBienDeUso')       result = eliminarFila('BienesDeUso', data.rowIndex);
    else if (action === 'eliminarAlquiler')        result = eliminarFila('Alquiler', data.rowIndex);
    else if (action === 'eliminarVentaDia')        result = eliminarFila('DatosDia', data.rowIndex);
    else if (action === 'eliminarVentaProducto')   result = eliminarFila('DatosProductos', data.rowIndex);
    else if (action === 'altaEmpleado')            result = altaEmpleado(data);
    else if (action === 'bajaEmpleado')            result = bajaEmpleado(data.id);
    else if (action === 'eliminarEmpleado')        result = eliminarEmpleado(data.id);
    else if (action === 'registrarProducto')       result = registrarProducto(data);
    else if (action === 'editarProducto')          result = editarProducto(data);
    else if (action === 'eliminarProducto')        result = eliminarProducto(data.nombre);
    else if (action === 'agregarIngrediente')      result = agregarIngrediente(data);
    else if (action === 'eliminarIngrediente')     result = eliminarIngrediente(data);
    else if (action === 'actualizarIngrediente')   result = actualizarIngrediente(data);
    else if (action === 'guardarPrecioBase')        result = guardarPrecioBase(data);
    else if (action === 'eliminarPrecioBase')       result = eliminarPrecioBase(data.insumo);
    else if (action === 'agregarInsumo')            result = agregarInsumo(data);
    else if (action === 'eliminarInsumo')           result = eliminarInsumo(data.nombre);
    else if (action === 'actualizarSubreceta')      result = actualizarSubreceta(data);
    else if (action === 'agregarSubreceta')         result = agregarSubreceta(data);
    else if (action === 'guardarParametrosVenta')   result = guardarParametrosVenta(data);
    else result = { ok: false, msg: 'Acción no reconocida: ' + action };

    return _json(result);
  } catch(err) {
    return _json({ ok: false, error: err.message });
  }
}

function _json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// HELPERS
// ============================================================
function _getFiltered(sheetName, mes, anio) {
  var sheet = getSpreadsheet().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() <= 1) return [];
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var tz = 'America/Argentina/Buenos_Aires';
  return data.slice(1).reduce(function(acc, row, idx) {
    if (!row[0]) return acc;
    if (mes || anio) {
      var raw = row[0];
      var d = (raw instanceof Date) ? raw : new Date(raw);
      if (isNaN(d.getTime())) return acc;
      if (mes  && d.getMonth() + 1 !== parseInt(mes))  return acc;
      if (anio && d.getFullYear()   !== parseInt(anio)) return acc;
    }
    var obj = { _rowIndex: idx + 2 };
    headers.forEach(function(h, i) {
      obj[h] = (row[i] instanceof Date)
        ? Utilities.formatDate(row[i], tz, 'dd/MM/yyyy')
        : row[i];
    });
    acc.push(obj);
    return acc;
  }, []);
}

function _sumSheet(sheetName, mes, anio, colName) {
  return _getFiltered(sheetName, mes, anio).reduce(function(sum, r) {
    return sum + (parseFloat(r[colName]) || 0);
  }, 0);
}

// ============================================================
// DASHBOARD
// ============================================================
function getDashboardData(mes, anio) {
  var ss = getSpreadsheet();
  var sheetDia = ss.getSheetByName('DatosDia');
  var ventasPorMes = [];
  var ventasMesActual = { total:0, descuentos:0, netas:0, pedidos:0 };
  var ventasMesAnt   = { total:0, descuentos:0, netas:0, pedidos:0 };
  var mesAnt  = mes === 1 ? 12 : mes - 1;
  var anioAnt = mes === 1 ? anio - 1 : anio;
  for (var m = 1; m <= 12; m++) ventasPorMes.push({ mes: m, valor: 0 });
  var NOMBRES_MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  var parFiscal = getParametrosVenta().parametros;
  if (sheetDia && sheetDia.getLastRow() > 1) {
    var dataDia = sheetDia.getDataRange().getValues();
    dataDia.slice(1).forEach(function(row) {
      var mesStr = String(row[0]).trim().toLowerCase();
      var idx = NOMBRES_MESES.indexOf(mesStr);
      if (idx < 0) return;
      var numMes = idx + 1;
      var anioFila = _vAnioFilaDia(row);
      var total = parseFloat(row[7])||0, desc = parseFloat(row[5])||0, peds = parseFloat(row[4])||0;
      if (anioFila === anio) {
        ventasPorMes[idx].valor += (total - desc) / (1 + _tasasFiscales(parFiscal, anio, numMes).iva);
        if (numMes === mes) { ventasMesActual.total+=total; ventasMesActual.descuentos+=desc; ventasMesActual.pedidos+=peds; }
      }
      if (numMes === mesAnt && anioFila === anioAnt) { ventasMesAnt.total+=total; ventasMesAnt.descuentos+=desc; }
    });
  }
  // Desde el inicio de la facturación las ventas se toman netas de IVA y generan IIBB + Seg. e Higiene.
  var tasasMes = _tasasFiscales(parFiscal, anio, mes), tasasAnt = _tasasFiscales(parFiscal, anioAnt, mesAnt);
  var ventasConIva = ventasMesActual.total - ventasMesActual.descuentos;
  ventasMesActual.netas = ventasConIva / (1 + tasasMes.iva);
  ventasMesAnt.netas    = (ventasMesAnt.total - ventasMesAnt.descuentos) / (1 + tasasAnt.iva);
  var ivaDebito = ventasConIva - ventasMesActual.netas;
  var impuestosVenta = ventasMesActual.netas * (tasasMes.iibb + tasasMes.seh);
  var mesesConDatos = ventasPorMes.filter(function(v){return v.valor>0;}).map(function(v){return v.mes;});
  var compras  = _sumSheet('Compras',         mes, anio, 'Subtotal');
  var gastosF  = _sumSheet('GastosFijos',     mes, anio, 'Monto');
  var gastosV  = _sumSheet('GastosVariables', mes, anio, 'Monto');
  var envios   = _sumSheet('Envíos',           mes, anio, 'Monto');
  var alquiler = _sumSheet('Alquiler',         mes, anio, 'Monto');
  var salarios = _sumSheet('Salarios',         mes, anio, 'SueldoNeto');
  var totalGastos = compras + gastosF + gastosV + envios + alquiler + salarios + impuestosVenta;
  var ventasNetas = ventasMesActual.netas;
  var resultadoNeto = ventasNetas - totalGastos;
  return {
    ventasBrutas:ventasMesActual.total, descuentos:ventasMesActual.descuentos,
    ventasNetas:ventasNetas, pedidos:ventasMesActual.pedidos,
    ivaDebito:ivaDebito, impuestosVenta:impuestosVenta, facturacionActiva:tasasMes.activo,
    ticketMedio: ventasMesActual.pedidos > 0 ? ventasMesActual.total / ventasMesActual.pedidos : 0,
    compras:compras, gastosF:gastosF, gastosVar:gastosV+envios,
    gastosFijos:gastosF+alquiler+salarios, alquiler:alquiler, salarios:salarios,
    totalGastos:totalGastos, resultadoNeto:resultadoNeto,
    margen: ventasNetas > 0 ? resultadoNeto / ventasNetas : 0,
    deltaVentas: ventasMesAnt.netas > 0 ? ((ventasNetas - ventasMesAnt.netas) / ventasMesAnt.netas) * 100 : 0,
    ventasPorMes:ventasPorMes, mesesConDatos:mesesConDatos,
  };
}

// ============================================================
// ESTADO DE RESULTADOS ANUAL
// ============================================================
function getEstadoResultados(anio) {
  var NOMBRES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  var ss = getSpreadsheet();
  var sheetDia = ss.getSheetByName('DatosDia');

  var meses = [];
  for (var m = 1; m <= 12; m++) {
    meses.push({
      mes: m,
      ventasBrutas:0, descuentos:0, ivaDebito:0, ventasNetas:0, impuestosVenta:0,
      compras:0, gastosVar:0, envios:0,
      gastosFijos:0, alquiler:0, salarios:0,
      amortizacion:0, bienesDeUso:0, retiros:0,
      totalVariable:0, totalFijo:0, totalEgresos:0, resultado:0, margen:0
    });
  }

  if (sheetDia && sheetDia.getLastRow() > 1) {
    sheetDia.getDataRange().getValues().slice(1).forEach(function(row) {
      var idx = NOMBRES.indexOf(String(row[0]).trim().toLowerCase());
      if (idx < 0 || _vAnioFilaDia(row) !== anio) return;
      meses[idx].ventasBrutas += parseFloat(row[7])||0;
      meses[idx].descuentos   += parseFloat(row[5])||0;
    });
  }

  var sheets = [
    { nombre:'Compras',         campo:'compras',     col:'Subtotal'   },
    { nombre:'GastosVariables', campo:'gastosVar',   col:'Monto'      },
    { nombre:'Envíos',           campo:'envios',      col:'Monto'      },
    { nombre:'GastosFijos',     campo:'gastosFijos', col:'Monto'      },
    { nombre:'Alquiler',        campo:'alquiler',    col:'Monto'      },
    { nombre:'Salarios',        campo:'salarios',    col:'SueldoNeto' },
  ];

  sheets.forEach(function(cfg) {
    var sheet = ss.getSheetByName(cfg.nombre);
    if (!sheet || sheet.getLastRow() <= 1) return;
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var colIdx = headers.indexOf(cfg.col);
    if (colIdx < 0) return;
    data.slice(1).forEach(function(row) {
      if (!row[0]) return;
      var d = (row[0] instanceof Date) ? row[0] : new Date(row[0]);
      if (isNaN(d.getTime()) || d.getFullYear() !== anio) return;
      meses[d.getMonth()][cfg.campo] += parseFloat(row[colIdx])||0;
    });
  });

  var sheetRetiros = ss.getSheetByName('Retiros');
  if (sheetRetiros && sheetRetiros.getLastRow() > 1) {
    var dataRet = sheetRetiros.getDataRange().getValues();
    var headersRet = dataRet[0];
    var colMonto = headersRet.indexOf('Monto');
    if (colMonto >= 0) {
      dataRet.slice(1).forEach(function(row) {
        if (!row[0]) return;
        var d = (row[0] instanceof Date) ? row[0] : new Date(row[0]);
        if (isNaN(d.getTime()) || d.getFullYear() !== anio) return;
        meses[d.getMonth()].retiros += parseFloat(row[colMonto])||0;
      });
    }
  }

  var sheetBDU = ss.getSheetByName('BienesDeUso');
  if (sheetBDU && sheetBDU.getLastRow() > 1) {
    var dataBDU = sheetBDU.getDataRange().getValues();
    var headersBDU = dataBDU[0];
    var colMontoBDU = headersBDU.indexOf('Monto');
    var colVidaBDU  = headersBDU.indexOf('VidaUtil');
    if (colMontoBDU < 0) colMontoBDU = 4;
    if (colVidaBDU  < 0) colVidaBDU  = 5;
    dataBDU.slice(1).forEach(function(row) {
      if (!row[0]) return;
      var d = (row[0] instanceof Date) ? row[0] : new Date(row[0]);
      if (isNaN(d.getTime()) || d.getFullYear() !== anio) return;
      var monto    = parseFloat(row[colMontoBDU]) || 0;
      var vidaUtil = parseFloat(row[colVidaBDU])  || 10;
      meses[d.getMonth()].bienesDeUso  += monto;
      meses[d.getMonth()].amortizacion += monto / (vidaUtil * 12);
    });
  }

  var parFiscal = getParametrosVenta().parametros;
  meses.forEach(function(m) {
    var tasas = _tasasFiscales(parFiscal, anio, m.mes);
    var conIva = m.ventasBrutas - m.descuentos;
    m.ventasNetas    = conIva / (1 + tasas.iva);
    m.ivaDebito      = conIva - m.ventasNetas;
    m.impuestosVenta = m.ventasNetas * (tasas.iibb + tasas.seh);
    m.facturacionActiva = tasas.activo;
    m.totalVariable = m.compras + m.gastosVar + m.envios + m.impuestosVenta;
    m.totalFijo     = m.gastosFijos + m.alquiler + m.salarios + m.amortizacion;
    m.totalEgresos  = m.totalVariable + m.totalFijo;
    m.resultado     = m.ventasNetas - m.totalEgresos;
    m.margen        = m.ventasNetas > 0 ? (m.resultado / m.ventasNetas) * 100 : 0;
  });

  var totales = {
    mes:0, ventasBrutas:0, descuentos:0, ivaDebito:0, ventasNetas:0, impuestosVenta:0,
    compras:0, gastosVar:0, envios:0, gastosFijos:0, alquiler:0,
    salarios:0, amortizacion:0, bienesDeUso:0, retiros:0,
    totalVariable:0, totalFijo:0, totalEgresos:0, resultado:0, margen:0
  };
  meses.forEach(function(m) {
    Object.keys(totales).forEach(function(k){
      if (k !== 'mes' && k !== 'margen') totales[k] += m[k];
    });
  });
  totales.margen = totales.ventasNetas > 0 ? (totales.resultado / totales.ventasNetas) * 100 : 0;

  return { anio: anio, meses: meses, totales: totales };
}

// ============================================================
// PROVEEDORES
// ============================================================
function getProveedores() {
  var sheet = getSpreadsheet().getSheetByName('Proveedores');
  if (!sheet || sheet.getLastRow() <= 1) return [];
  var data = sheet.getDataRange().getValues();
  return data.slice(1).filter(function(r){return r[1];}).map(function(r){
    return { id:r[0], nombre:r[1], contacto:r[2], telefono:r[3], cuit:r[4], notas:r[5] };
  });
}
function agregarProveedor(data) {
  var sheet = getSpreadsheet().getSheetByName('Proveedores');
  sheet.appendRow([sheet.getLastRow(), data.nombre, data.contacto||'', data.telefono||'', data.cuit||'', data.notas||'', new Date().toLocaleDateString('es-AR')]);
  return { ok: true };
}
function eliminarProveedor(data) {
  var sheet = getSpreadsheet().getSheetByName('Proveedores');
  if (!sheet || sheet.getLastRow() <= 1) return { ok: false, msg: 'No hay proveedores' };
  var rows = sheet.getDataRange().getValues();
  for (var i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][0]) === String(data.id)) { sheet.deleteRow(i + 1); return { ok: true }; }
  }
  return { ok: false, msg: 'Proveedor no encontrado' };
}

// ============================================================
// PLATAFORMAS
// ============================================================
function _ensurePlataformas() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Plataformas');
  if (!sheet) {
    sheet = ss.insertSheet('Plataformas');
    var headers = ['ID','Nombre','CUIT','Direccion','FechaAlta'];
    sheet.appendRow(headers);
    sheet.getRange(1,1,1,headers.length).setFontWeight('bold').setBackground('#233f20').setFontColor('#fcebca');
    sheet.setFrozenRows(1);
    var tz = 'America/Argentina/Buenos_Aires';
    var hoy = Utilities.formatDate(new Date(), tz, 'dd/MM/yyyy');
    [[1,'RestoSimple','','',hoy],[2,'RAPPI','30-71559154-9','',hoy],[3,'Venta Mayorista','','',hoy],[4,'OTROS','','',hoy]]
      .forEach(function(r){ sheet.appendRow(r); });
  }
  return sheet;
}
function getPlataformas() {
  var sheet = _ensurePlataformas();
  if (sheet.getLastRow() <= 1) return [];
  var data = sheet.getDataRange().getValues();
  return data.slice(1).filter(function(r){return r[0]&&r[1];}).map(function(r){
    return { id:r[0], nombre:String(r[1]).trim(), cuit:String(r[2]||'').trim(), direccion:String(r[3]||'').trim() };
  });
}
function agregarPlataforma(data) {
  var sheet = _ensurePlataformas();
  var lastRow = sheet.getLastRow(), maxId = 0;
  if (lastRow > 1) { var ids = sheet.getRange(2,1,lastRow-1,1).getValues(); ids.forEach(function(r){ if(parseFloat(r[0])>maxId) maxId=parseFloat(r[0]); }); }
  var tz = 'America/Argentina/Buenos_Aires';
  sheet.appendRow([maxId+1, data.nombre.trim(), data.cuit||'', data.direccion||'', Utilities.formatDate(new Date(), tz, 'dd/MM/yyyy')]);
  return { ok:true, id:maxId+1, nombre:data.nombre.trim() };
}
function eliminarPlataforma(id) {
  var sheet = getSpreadsheet().getSheetByName('Plataformas');
  if (!sheet || sheet.getLastRow() <= 1) return { ok:false };
  if (parseFloat(id) <= 4) return { ok:false, msg:'No se pueden eliminar las plataformas base' };
  var data = sheet.getDataRange().getValues();
  for (var i=data.length-1; i>=1; i--) { if(String(data[i][0])===String(id)){ sheet.deleteRow(i+1); return {ok:true}; } }
  return { ok:false };
}

// ============================================================
// COMPRAS / GASTOS / ENVIOS / BIENES / ALQUILER
// ============================================================

// ── PUNTO 3: Anti-duplicado de comprobantes ──
// Verifica si ya existe un comprobante igual del mismo proveedor
function verificarComprobante(comprobante, proveedor) {
  if (!comprobante || !comprobante.trim()) return { duplicado: false }; // sin comprobante, no verificar
  var sheet = getSpreadsheet().getSheetByName('Compras');
  if (!sheet || sheet.getLastRow() <= 1) return { duplicado: false };
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var colComp = headers.indexOf('Comprobante');
  var colProv = headers.indexOf('Proveedor');
  if (colComp < 0) colComp = 13;
  if (colProv < 0) colProv = 1;
  var compNorm = String(comprobante).trim().toUpperCase();
  var provNorm = String(proveedor||'').trim().toUpperCase();
  for (var i = 1; i < data.length; i++) {
    var existComp = String(data[i][colComp]||'').trim().toUpperCase();
    var existProv = String(data[i][colProv]||'').trim().toUpperCase();
    if (existComp && existComp === compNorm && (!provNorm || existProv === provNorm)) {
      return { duplicado: true, fila: i + 1 };
    }
  }
  return { duplicado: false };
}

function registrarCompra(data) {
  // ── PUNTO 3: Verificar duplicado de comprobante ──
  if (data.comprobante && String(data.comprobante).trim()) {
    var check = verificarComprobante(data.comprobante, data.proveedor);
    if (check.duplicado) {
      return { ok: false, duplicado: true, msg: 'El comprobante "' + data.comprobante + '" ya está registrado para este proveedor.' };
    }
  }
  var sheet = getSpreadsheet().getSheetByName('Compras');
  sheet.appendRow([data.fecha, data.proveedor||'', data.insumo, data.unidad,
    parseFloat(data.cantidad)||0, parseFloat(data.precioUnit)||0, parseFloat(data.subtotal)||0,
    parseFloat(data.iva)||0, parseFloat(data.ivaMonto)||0, parseFloat(data.montoTotal)||0,
    parseFloat(data.percepcionIVA)||0, parseFloat(data.percepcionIIBB)||0,
    parseFloat(data.percepcionGanancias)||0, data.comprobante||'', data.notas||'']);
  return { ok:true };
}

function eliminarFila(sheetName, rowIndex, idVal) {
  var sheet = getSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return { ok: false, msg: 'Hoja "' + sheetName + '" no encontrada' };
  if (idVal !== undefined && idVal !== null) {
    var rows = sheet.getDataRange().getValues();
    for (var i = rows.length - 1; i >= 1; i--) {
      if (String(rows[i][0]) === String(idVal)) { sheet.deleteRow(i+1); return {ok:true}; }
    }
    return { ok: false, msg: 'Registro no encontrado' };
  }
  var ri = parseInt(rowIndex);
  if (!ri || ri < 2) return { ok: false, msg: 'Fila inválida' };
  if (ri > sheet.getLastRow()) return { ok: false, msg: 'Fila fuera de rango' };
  sheet.deleteRow(ri);
  return { ok: true };
}

function eliminarCompra(data) { return eliminarFila('Compras', data.rowIndex); }

function registrarGastoFijo(data) {
  getSpreadsheet().getSheetByName('GastosFijos')
    .appendRow([data.fecha, data.concepto, data.categoria||'', data.periodo||'', parseFloat(data.monto)||0, data.proveedor||'', data.notas||'']);
  return { ok:true };
}
function registrarGastoVariable(data) {
  getSpreadsheet().getSheetByName('GastosVariables')
    .appendRow([data.fecha, data.concepto, data.categoria||'', parseFloat(data.monto)||0, data.proveedor||'', data.notas||'']);
  return { ok:true };
}
function registrarEnvio(data) {
  getSpreadsheet().getSheetByName('Envíos')
    .appendRow([data.fecha, data.plataforma, data.descripcion||'', parseFloat(data.monto)||0, data.notas||'']);
  return { ok:true };
}
var VIDA_UTIL = { 'Rodados':5,'Cubiertos':10,'Mobiliario':10,'Cartelería':5,'Instalaciones':10 };
function registrarBienDeUso(data) {
  getSpreadsheet().getSheetByName('BienesDeUso')
    .appendRow([data.fecha, data.categoria, data.descripcion, data.proveedor||'', parseFloat(data.monto)||0, VIDA_UTIL[data.categoria]||10, data.notas||'']);
  return { ok:true };
}
function registrarAlquiler(data) {
  getSpreadsheet().getSheetByName('Alquiler')
    .appendRow([data.fecha, data.periodo, parseFloat(data.monto)||0, data.notas||'']);
  return { ok:true };
}

// ============================================================
// RESUMEN MENSUAL
// ============================================================
function getResumenMensual(mes, anio) {
  var compras=_sumSheet('Compras',mes,anio,'Subtotal'), gastosFijos=_sumSheet('GastosFijos',mes,anio,'Monto'),
      gastosVar=_sumSheet('GastosVariables',mes,anio,'Monto'), envios=_sumSheet('Envíos',mes,anio,'Monto'),
      bienesDeUso=_sumSheet('BienesDeUso',mes,anio,'Monto'), alquiler=_sumSheet('Alquiler',mes,anio,'Monto'),
      salarios=_sumSheet('Salarios',mes,anio,'SueldoNeto'), retiros=_sumSheet('Retiros',mes,anio,'Monto');
  var totalFijo=gastosFijos+alquiler+salarios, totalVariable=compras+gastosVar+envios;
  return { compras:compras, gastosFijos:gastosFijos, gastosVar:gastosVar, envios:envios,
    bienesDeUso:bienesDeUso, alquiler:alquiler, salarios:salarios, retiros:retiros,
    totalFijo:totalFijo, totalVariable:totalVariable, total:totalFijo+totalVariable+bienesDeUso+retiros };
}

// ============================================================
// EMPLEADOS / SALARIOS / RETIROS
// ============================================================
function getEmpleados(soloActivos) {
  var sheet = getSpreadsheet().getSheetByName('Empleados');
  if (!sheet || sheet.getLastRow() <= 1) return [];
  var data = sheet.getDataRange().getValues();
  var tz = 'America/Argentina/Buenos_Aires';
  return data.slice(1).filter(function(r){return r[0]&&(!soloActivos||r[7]==='Activo');}).map(function(r){
    return { id:r[0], nombre:r[1], apellido:r[2], dni:r[3], puesto:r[4],
      fechaIngreso:(r[5] instanceof Date)?Utilities.formatDate(r[5],tz,'dd/MM/yyyy'):r[5],
      estado:r[7], notas:r[8] };
  });
}
function altaEmpleado(data) {
  var sheet = getSpreadsheet().getSheetByName('Empleados');
  sheet.appendRow([sheet.getLastRow(), data.nombre, data.apellido, data.dni||'', data.puesto||'', data.fechaIngreso||'', '', 'Activo', data.notas||'']);
  return { ok:true };
}
function bajaEmpleado(id) {
  var sheet = getSpreadsheet().getSheetByName('Empleados');
  var data = sheet.getDataRange().getValues();
  for (var i=1; i<data.length; i++) {
    if (data[i][0]==id) { sheet.getRange(i+1,7).setValue(new Date().toLocaleDateString('es-AR')); sheet.getRange(i+1,8).setValue('Inactivo'); return {ok:true}; }
  }
  return { ok:false };
}
function eliminarEmpleado(id) { return eliminarFila('Empleados', null, id); }
function registrarSalario(data) {
  var sheet = getSpreadsheet().getSheetByName('Salarios');
  var bruto=parseFloat(data.sueldoBruto)||0, reten=parseFloat(data.retencionEmpleado)||0,
      extras=parseFloat(data.horasExtra)||0, present=parseFloat(data.presentismo)||0;
  sheet.appendRow([data.fecha, data.empleado, data.periodo, bruto, parseFloat(data.aportePatronal)||0,
    reten, parseFloat(data.art)||0, extras, present, bruto-reten+extras+present, data.notas||'']);
  return { ok:true };
}
function registrarRetiro(data) {
  getSpreadsheet().getSheetByName('Retiros')
    .appendRow([data.fecha, data.socio, parseFloat(data.monto)||0, data.notas||'']);
  return { ok:true };
}

// ============================================================
// VENTAS
// ============================================================
// Columna Origen: distingue lo importado de RestoSimple de la carga manual.
// DatosDia:       Mes | Fecha | Canal de venta | Método de pago | Pedidos | Descuentos | Ticket medio | Total | Origen
// DatosProductos: Mes | Producto | Cantidad | Subtotal | Origen
var V_ORIGEN_RS     = 'RestoSimple';
var V_ORIGEN_MANUAL = 'Manual';
var V_COL_ORIGEN_DIA  = 9;
var V_COL_ORIGEN_PROD = 5;
// Columna Año: DatosDia col 10 (J), DatosProductos col 6 (F). Las filas viejas sin año son de 2026.
var V_COL_ANIO_DIA  = 10;
var V_COL_ANIO_PROD = 6;
var V_ANIO_INICIAL  = 2026;
var V_NOMBRES_MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

function _vMesNorm(mes) {
  if (typeof mes === 'number') return V_NOMBRES_MESES[mes - 1] || '';
  var s = String(mes || '').trim().toLowerCase();
  if (/^[0-9]+$/.test(s)) return V_NOMBRES_MESES[parseInt(s, 10) - 1] || '';
  return V_NOMBRES_MESES.indexOf(s) >= 0 ? s : '';
}
function _vAnioNum(anio) {
  var a = parseInt(anio, 10);
  return (a > 1900 && a < 3000) ? a : 0;
}
function _vAnioDeFecha(v) {
  if (v instanceof Date && !isNaN(v.getTime())) return v.getFullYear();
  var p = String(v || '').trim().split('/');
  return p.length === 3 ? _vAnioNum(p[2]) : 0;
}
// Año de una fila de ventas: columna Año; si está vacía, el de la fecha (solo DatosDia); si no, 2026.
function _vAnioFila(row, colAnio, colFecha) {
  var a = _vAnioNum(row[colAnio - 1]);
  if (a) return a;
  if (colFecha) { a = _vAnioDeFecha(row[colFecha - 1]); if (a) return a; }
  return V_ANIO_INICIAL;
}
function _vAnioFilaDia(row)  { return _vAnioFila(row, V_COL_ANIO_DIA, 2); }
function _vAnioFilaProd(row) { return _vAnioFila(row, V_COL_ANIO_PROD, 0); }

// Crea la columna Año si no existe y completa las filas existentes.
function _vAsegurarAnio(sheet, colAnio, colFecha) {
  var header = String(sheet.getRange(1, colAnio).getValue() || '').trim();
  if (header === 'Año') return;
  if (header) throw new Error('La hoja ' + sheet.getName() + ' ya tiene otra columna en la posición ' + colAnio + ': ' + header);
  sheet.getRange(1, colAnio).setValue('Año');
  sheet.getRange(1, 1).copyTo(sheet.getRange(1, colAnio), SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
  var n = sheet.getLastRow() - 1;
  if (n < 1) return;
  var data = sheet.getRange(2, 1, n, colAnio).getValues();
  sheet.getRange(2, colAnio, n, 1).setValues(data.map(function(r) {
    return [String(r[0] || '').trim() ? _vAnioFila(r, colAnio, colFecha) : ''];
  }));
}
function _vAsegurarDia(sheet)  { _vAsegurarOrigen(sheet, V_COL_ORIGEN_DIA);  _vAsegurarAnio(sheet, V_COL_ANIO_DIA, 2); }
function _vAsegurarProd(sheet) { _vAsegurarOrigen(sheet, V_COL_ORIGEN_PROD); _vAsegurarAnio(sheet, V_COL_ANIO_PROD, 0); }

// Crea las columnas Origen y Año en las hojas de ventas (se puede llamar varias veces).
function prepararVentas() {
  return _vConLock(function() {
    var ss = getSpreadsheet();
    var sDia = ss.getSheetByName('DatosDia'), sProd = ss.getSheetByName('DatosProductos');
    if (sDia)  _vAsegurarDia(sDia);
    if (sProd) _vAsegurarProd(sProd);
    return { ok:true };
  });
}
function _vMesCap(mesNorm) {
  return mesNorm ? mesNorm.charAt(0).toUpperCase() + mesNorm.slice(1) : '';
}
function _vMesDesdeFecha(fecha) {
  var p = String(fecha || '').trim().split('/');
  if (p.length !== 3) return '';
  return V_NOMBRES_MESES[parseInt(p[1], 10) - 1] || '';
}
function _vConLock(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try { return fn(); } finally { lock.releaseLock(); }
}

// Crea la columna Origen si no existe y clasifica las filas existentes:
// la carga manual siempre grabó el mes en minúscula ("abril"); la importación, con mayúscula ("Abril").
function _vAsegurarOrigen(sheet, colOrigen) {
  var header = String(sheet.getRange(1, colOrigen).getValue() || '').trim();
  if (header === 'Origen') return;
  if (header) throw new Error('La hoja ' + sheet.getName() + ' ya tiene otra columna en la posición ' + colOrigen + ': ' + header);
  sheet.getRange(1, colOrigen).setValue('Origen');
  sheet.getRange(1, 1).copyTo(sheet.getRange(1, colOrigen), SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
  var n = sheet.getLastRow() - 1;
  if (n < 1) return;
  var meses = sheet.getRange(2, 1, n, 1).getValues();
  var valores = meses.map(function(r) {
    var m = String(r[0] || '').trim();
    if (!m) return [''];
    var esManual = m.charAt(0) !== m.charAt(0).toUpperCase();
    return [esManual ? V_ORIGEN_MANUAL : V_ORIGEN_RS];
  });
  sheet.getRange(2, colOrigen, n, 1).setValues(valores);
}

// Reescribe la hoja conservando solo las filas para las que conservar(row) es true.
// Es atómico: no hay corrimiento de números de fila entre borrados.
function _vReescribir(sheet, conservar) {
  var lastRow = sheet.getLastRow(), lastCol = sheet.getLastColumn();
  if (lastRow <= 1) return 0;
  var data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  var quedan = data.filter(conservar);
  var borradas = data.length - quedan.length;
  if (!borradas) return 0;
  sheet.getRange(2, 1, lastRow - 1, lastCol).clearContent();
  if (quedan.length) sheet.getRange(2, 1, quedan.length, lastCol).setValues(quedan);
  return borradas;
}

// Filas que no son ventas: encabezado repetido y pie del export de RestoSimple.
function _vEsBasuraDia(f) {
  var x = String(f.fecha || '').trim().toLowerCase();
  return !x || x === 'fecha' || x.indexOf('reporte') === 0 || x === 'total' || x === 'totales';
}
function _vEsBasuraProd(f) {
  var x = String(f.producto || '').trim().toLowerCase();
  return !x || x === 'producto' || x.indexOf('reporte generado') === 0 || x === 'total' || x === 'totales';
}

function _vEsDelMes(row, mesN) { return String(row[0] || '').trim().toLowerCase() === mesN; }
function _vEsDelPeriodoDia(row, mesN, anio)  { return _vEsDelMes(row, mesN) && (!anio || _vAnioFilaDia(row)  === anio); }
function _vEsDelPeriodoProd(row, mesN, anio) { return _vEsDelMes(row, mesN) && (!anio || _vAnioFilaProd(row) === anio); }

// Importa (o actualiza) un mes desde RestoSimple: reemplaza solo lo importado antes y conserva la carga manual.
function importarVentasDia(mes, filas, anio) {
  return _vConLock(function() {
    var sheet = getSpreadsheet().getSheetByName('DatosDia');
    if (!sheet) return { ok:false, msg:'Hoja DatosDia no encontrada' };
    _vAsegurarDia(sheet);
    var mesN = _vMesNorm(mes), mesCap = _vMesCap(mesN);
    if (!mesN) return { ok:false, msg:'Mes inválido' };
    filas = filas || [];
    var anioN = _vAnioNum(anio);
    if (!anioN) { for (var i = 0; i < filas.length && !anioN; i++) anioN = _vAnioDeFecha(filas[i].fecha); }
    if (!anioN) return { ok:false, msg:'Año inválido' };
    var reemplazadas = _vReescribir(sheet, function(r) {
      return !(_vEsDelPeriodoDia(r, mesN, anioN) && String(r[V_COL_ORIGEN_DIA - 1]).trim() !== V_ORIGEN_MANUAL);
    });
    var validas = filas.filter(function(f){ return !_vEsBasuraDia(f); });
    var rows = validas.map(function(f) {
      return [mesCap, f.fecha||'', f.canal||'', f.metodo||'', parseFloat(f.pedidos)||0,
              parseFloat(f.descuentos)||0, parseFloat(f.ticketMedio)||0, parseFloat(f.total)||0, V_ORIGEN_RS, anioN];
    });
    if (rows.length) sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, V_COL_ANIO_DIA).setValues(rows);
    return { ok:true, count:rows.length, reemplazadas:reemplazadas, descartadas:filas.length - validas.length };
  });
}
function importarVentasProductos(mes, filas, anio) {
  return _vConLock(function() {
    var sheet = getSpreadsheet().getSheetByName('DatosProductos');
    if (!sheet) return { ok:false, msg:'Hoja DatosProductos no encontrada' };
    _vAsegurarProd(sheet);
    var mesN = _vMesNorm(mes), mesCap = _vMesCap(mesN);
    if (!mesN) return { ok:false, msg:'Mes inválido' };
    var anioN = _vAnioNum(anio);
    if (!anioN) return { ok:false, msg:'Año inválido' };
    filas = filas || [];
    var reemplazadas = _vReescribir(sheet, function(r) {
      return !(_vEsDelPeriodoProd(r, mesN, anioN) && String(r[V_COL_ORIGEN_PROD - 1]).trim() !== V_ORIGEN_MANUAL);
    });
    var validas = filas.filter(function(f){ return !_vEsBasuraProd(f); });
    var rows = validas.map(function(f) {
      return [mesCap, f.producto||'', parseFloat(f.cantidad)||0, parseFloat(f.subtotal)||0, V_ORIGEN_RS, anioN];
    });
    if (rows.length) sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, V_COL_ANIO_PROD).setValues(rows);
    return { ok:true, count:rows.length, reemplazadas:reemplazadas, descartadas:filas.length - validas.length };
  });
}

// "Borrar y reimportar": por defecto borra solo lo importado de RestoSimple y conserva la carga manual.
function borrarVentasMes(mes, incluirManual, anio) {
  return borrarVentas({ mes: mes, anio: anio, tipo: 'ambos', origen: incluirManual ? '' : V_ORIGEN_RS });
}

// Borrado selectivo atómico.
// data: { mes, anio, canal (opcional, solo aplica a ventas por día), tipo: 'ventasDia'|'ventasProductos'|'ambos', origen: ''|'RestoSimple'|'Manual' }
// Sin anio válido no borra nada (evita borrar el mismo mes de todos los años).
function borrarVentas(data) {
  return _vConLock(function() {
    var ss = getSpreadsheet();
    var mesN = _vMesNorm(data.mes);
    if (!mesN) return { ok:false, msg:'Mes inválido' };
    var anioN = _vAnioNum(data.anio);
    if (!anioN) return { ok:false, msg:'Año inválido' };
    var canal  = String(data.canal || '').trim().toLowerCase();
    var origen = String(data.origen || '').trim();
    var tipo   = data.tipo || 'ambos';
    var res = { ok:true, borradasDia:0, borradasProd:0, productosOmitidos:false };

    if (tipo === 'ventasDia' || tipo === 'ambos') {
      var sDia = ss.getSheetByName('DatosDia');
      if (sDia) {
        _vAsegurarDia(sDia);
        res.borradasDia = _vReescribir(sDia, function(r) {
          var coincide = _vEsDelPeriodoDia(r, mesN, anioN)
            && (!canal  || String(r[2] || '').trim().toLowerCase() === canal)
            && (!origen || String(r[V_COL_ORIGEN_DIA - 1] || '').trim() === origen);
          return !coincide;
        });
      }
    }
    if (tipo === 'ventasProductos' || tipo === 'ambos') {
      if (canal) {
        // Las ventas por producto no tienen canal: no se pueden filtrar por canal.
        res.productosOmitidos = true;
      } else {
        var sProd = ss.getSheetByName('DatosProductos');
        if (sProd) {
          _vAsegurarProd(sProd);
          res.borradasProd = _vReescribir(sProd, function(r) {
            var coincide = _vEsDelPeriodoProd(r, mesN, anioN)
              && (!origen || String(r[V_COL_ORIGEN_PROD - 1] || '').trim() === origen);
            return !coincide;
          });
        }
      }
    }
    return res;
  });
}

// Carga manual: el mes sale de la fecha de la venta y se marca como Manual.
function registrarVentaManual(data) {
  return _vConLock(function() {
    var ss = getSpreadsheet();
    var sheetDia = ss.getSheetByName('DatosDia'), sheetProd = ss.getSheetByName('DatosProductos');
    if (!sheetDia || !sheetProd) return { ok:false, msg:'Hojas de ventas no encontradas' };
    _vAsegurarDia(sheetDia);
    _vAsegurarProd(sheetProd);
    var mesN = _vMesDesdeFecha(data.fecha);
    var anioN = _vAnioDeFecha(data.fecha);
    if (!mesN || !anioN) return { ok:false, msg:'Fecha inválida' };
    var mesCap = _vMesCap(mesN);
    var items = data.items || [];
    var totalItems = items.reduce(function(s, it){ return s + (parseFloat(it.subtotal) || 0); }, 0);
    var desc = parseFloat(data.descuentos) || 0;
    var totalNeto = totalItems - desc;
    sheetDia.getRange(sheetDia.getLastRow() + 1, 1, 1, V_COL_ANIO_DIA).setValues([[
      mesCap, data.fecha, data.plataforma || 'Manual', data.metodo || 'Efectivo', 1, desc, totalNeto, totalNeto, V_ORIGEN_MANUAL, anioN
    ]]);
    var rowsProd = items.filter(function(it){ return it.producto && String(it.producto).trim(); }).map(function(it) {
      return [mesCap, String(it.producto).trim(), parseFloat(it.cantidad) || 1, parseFloat(it.subtotal) || 0, V_ORIGEN_MANUAL, anioN];
    });
    if (rowsProd.length) sheetProd.getRange(sheetProd.getLastRow() + 1, 1, rowsProd.length, V_COL_ANIO_PROD).setValues(rowsProd);
    return { ok:true, mes:mesCap, anio:anioN };
  });
}
function getVentasMesCompleto(mes, anio) {
  var ss = getSpreadsheet();
  var sheetDia=ss.getSheetByName('DatosDia'), sheetProd=ss.getSheetByName('DatosProductos');
  var tz = 'America/Argentina/Buenos_Aires';
  if(!sheetDia||sheetDia.getLastRow()<=1) return { tieneDatos:false };
  var dataDia=sheetDia.getDataRange().getValues();
  var DIAS=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  var mesNombre=String(mes).trim().toLowerCase(), anioN=_vAnioNum(anio);
  var filasDia=dataDia.slice(1).filter(function(row){return _vEsDelPeriodoDia(row, mesNombre, anioN);});
  if(!filasDia.length) return { tieneDatos:false };
  var totalVentas=0,descuentos=0,pedidos=0,diasSet={},canalesMap={},metodosMap={},diasMap={};
  filasDia.forEach(function(row){
    var fechaStr=(row[1] instanceof Date)?Utilities.formatDate(row[1],tz,'dd/MM/yyyy'):String(row[1]).trim();
    var canal=String(row[2]).trim(),metodo=String(row[3]).trim();
    var peds=parseFloat(row[4])||0,desc=parseFloat(row[5])||0,total=parseFloat(row[7])||0;
    totalVentas+=total;descuentos+=desc;pedidos+=peds;diasSet[fechaStr]=1;
    if(!canalesMap[canal]) canalesMap[canal]={canal:canal,total:0,pedidos:0};
    canalesMap[canal].total+=total;canalesMap[canal].pedidos+=peds;
    if(!metodosMap[metodo]) metodosMap[metodo]={metodo:metodo,total:0};
    metodosMap[metodo].total+=total;
    var partes=fechaStr.split('/');
    if(partes.length===3){var d=new Date(parseInt(partes[2]),parseInt(partes[1])-1,parseInt(partes[0]));
      if(!isNaN(d.getTime())){var idx=d.getDay();if(!diasMap[idx])diasMap[idx]={dia:DIAS[idx],total:0};diasMap[idx].total+=total;}}
  });
  var productos=[];
  if(sheetProd&&sheetProd.getLastRow()>1){
    var dataProd=sheetProd.getDataRange().getValues();
    dataProd.slice(1).forEach(function(row){if(_vEsDelPeriodoProd(row, mesNombre, anioN))productos.push({producto:String(row[1]).trim(),cantidad:parseFloat(row[2])||0,subtotal:parseFloat(row[3])||0});});
    productos.sort(function(a,b){return b.subtotal-a.subtotal;});
  }
  return { tieneDatos:true, totalVentas:totalVentas, descuentos:descuentos, pedidos:pedidos,
    diasUnicos:Object.keys(diasSet).length,
    porCanal:Object.keys(canalesMap).map(function(k){return canalesMap[k];}).sort(function(a,b){return b.total-a.total;}),
    porMetodo:Object.keys(metodosMap).map(function(k){return metodosMap[k];}).sort(function(a,b){return b.total-a.total;}),
    porDiaSemana:[1,2,3,4,5,6,0].map(function(i){return diasMap[i]||{dia:DIAS[i],total:0};}),
    productos:productos };
}
function getVentasHistorial(sheetName, mes, anio) {
  var sheet = getSpreadsheet().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() <= 1) return [];
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var tz = 'America/Argentina/Buenos_Aires';
  var NOMBRES_MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  var esDia = sheetName === 'DatosDia', anioN = _vAnioNum(anio);
  return data.slice(1).reduce(function(acc, row, idx) {
    if (!row[0]) return acc;
    if (mes) {
      var mesNombre = NOMBRES_MESES[parseInt(mes)-1] || '';
      if (String(row[0]).trim().toLowerCase() !== mesNombre) return acc;
    }
    if (anioN && (esDia ? _vAnioFilaDia(row) : _vAnioFilaProd(row)) !== anioN) return acc;
    var obj = { _rowIndex: idx + 2 };
    headers.forEach(function(h, i) {
      obj[h] = (row[i] instanceof Date) ? Utilities.formatDate(row[i], tz, 'dd/MM/yyyy') : row[i];
    });
    acc.push(obj);
    return acc;
  }, []);
}
function getVentasParaExportar(mes, anio) {
  var ss=getSpreadsheet(), tz='America/Argentina/Buenos_Aires';
  var mesNombre=String(mes).trim().toLowerCase(), anioN=_vAnioNum(anio), resultado={dia:[],productos:[]};
  var sheetDia=ss.getSheetByName('DatosDia'), sheetProd=ss.getSheetByName('DatosProductos');
  if(sheetDia&&sheetDia.getLastRow()>1){
    sheetDia.getDataRange().getValues().slice(1).forEach(function(row){
      if(!_vEsDelPeriodoDia(row, mesNombre, anioN)) return;
      var fechaStr=(row[1] instanceof Date)?Utilities.formatDate(row[1],tz,'dd/MM/yyyy'):String(row[1]).trim();
      resultado.dia.push({Fecha:fechaStr,Canal:String(row[2]).trim(),Metodo:String(row[3]).trim(),
        Pedidos:parseFloat(row[4])||0,Descuentos:parseFloat(row[5])||0,TicketMedio:parseFloat(row[6])||0,Total:parseFloat(row[7])||0});
    });
  }
  if(sheetProd&&sheetProd.getLastRow()>1){
    sheetProd.getDataRange().getValues().slice(1).forEach(function(row){
      if(!_vEsDelPeriodoProd(row, mesNombre, anioN)) return;
      resultado.productos.push({Producto:String(row[1]).trim(),Cantidad:parseFloat(row[2])||0,Subtotal:parseFloat(row[3])||0});
    });
    resultado.productos.sort(function(a,b){return b.Subtotal-a.Subtotal;});
  }
  return resultado;
}

// ============================================================
// PRODUCTOS Y RECETAS
// ============================================================

// ── PUNTO 7: getPreciosUltimaCompra ahora acepta fechaCorte ──
// Si se pasa fechaCorte (Date), solo considera compras con fecha <= fechaCorte
// Para reportes históricos: pasar el último día del mes analizado
// Para uso actual: sin parámetro → usa la última compra disponible
function getPreciosUltimaCompra(fechaCorte) {
  var tz = 'America/Argentina/Buenos_Aires';
  var mapa = {};
  var corte = fechaCorte ? (fechaCorte instanceof Date ? fechaCorte : new Date(fechaCorte)) : null;

  // PASO 1: leer precios reales desde la hoja Compras
  var sheetCompras = getSpreadsheet().getSheetByName('Compras');
  if (sheetCompras && sheetCompras.getLastRow() > 1) {
    var data = sheetCompras.getDataRange().getValues();
    var headers = data[0];
    var colFecha  = headers.indexOf('Fecha');
    var colInsumo = headers.indexOf('Insumo');
    var colPrecio = headers.indexOf('PrecioUnit');
    var colUnidad = headers.indexOf('Unidad');
    if (colFecha  < 0) colFecha  = 0;
    if (colInsumo < 0) colInsumo = 2;
    if (colPrecio < 0) colPrecio = 5;
    if (colUnidad < 0) colUnidad = 3;
    data.slice(1).forEach(function(row) {
      var insumo = String(row[colInsumo] || '').trim().toUpperCase();
      var precio = parseFloat(row[colPrecio]) || 0;
      if (!insumo || precio <= 0) return;
      // Compras sin unidad real (OTROS o vacía) son el total de una factura, no un precio unitario: no se usan para costear.
      var unidad = String(row[colUnidad] || '').trim().toUpperCase();
      if (!unidad || unidad === 'OTROS') return;
      var raw = row[colFecha];
      var d = (raw instanceof Date) ? raw : new Date(raw);
      if (isNaN(d.getTime())) return;
      // ── PUNTO 7: respetar la fecha de corte ──
      if (corte && d > corte) return;
      if (!mapa[insumo] || d > mapa[insumo].fechaObj) {
        mapa[insumo] = { precioUnit: precio, fecha: Utilities.formatDate(d, tz, 'dd/MM/yyyy'), fechaObj: d, fuente: 'compras' };
      }
    });
  }

  // PASO 2: fallback a PreciosBase solo para insumos sin compras registradas
  var sheetBase = getSpreadsheet().getSheetByName('PreciosBase');
  if (sheetBase && sheetBase.getLastRow() > 1) {
    var dataBase = sheetBase.getDataRange().getValues();
    var headersBase = dataBase[0];
    var colInsBase    = headersBase.indexOf('Insumo');
    var colPrecioBase = headersBase.indexOf('PrecioUnit');
    if (colInsBase    < 0) colInsBase    = 0;
    if (colPrecioBase < 0) colPrecioBase = 1;
    dataBase.slice(1).forEach(function(row) {
      var insumo = String(row[colInsBase] || '').trim().toUpperCase();
      var precio = parseFloat(row[colPrecioBase]) || 0;
      if (!insumo || precio <= 0) return;
      if (!mapa[insumo]) {
        mapa[insumo] = { precioUnit: precio, fecha: 'referencia', fuente: 'PreciosBase' };
      }
    });
  }

  // Limpiar fechaObj antes de devolver
  Object.keys(mapa).forEach(function(k) { delete mapa[k].fechaObj; });
  return mapa;
}

// ── PUNTO 7: Versión de getProductos que acepta mes/anio para reportes históricos ──
// Si no se pasa mes/anio, comportamiento actual (precios más recientes)
function getPreciosUltimaVenta() {
  var ss = getSpreadsheet();
  var sheetProd = ss.getSheetByName('DatosProductos');
  if (!sheetProd || sheetProd.getLastRow() <= 1) return {};
  var NOMBRES = ['enero','febrero','marzo','abril','mayo','junio','julio',
                 'agosto','septiembre','octubre','noviembre','diciembre'];
  var data = sheetProd.getDataRange().getValues();
  var mapa = {};
  data.slice(1).forEach(function(row) {
    var mesStr   = String(row[0] || '').trim().toLowerCase();
    var producto = String(row[1] || '').trim().toUpperCase();
    var cantidad = parseFloat(row[2]) || 0;
    var subtotal = parseFloat(row[3]) || 0;
    if (!producto || cantidad <= 0 || subtotal <= 0) return;
    var mesIdx = NOMBRES.indexOf(mesStr);
    if (mesIdx < 0) return;
    var anioFila = _vAnioFilaProd(row);
    var orden = anioFila * 12 + mesIdx;
    var precio = subtotal / cantidad;
    if (!mapa[producto] || orden > mapa[producto].orden) {
      mapa[producto] = { precio: Math.round(precio), orden: orden, mes: NOMBRES[mesIdx], anio: anioFila };
    }
  });
  Object.keys(mapa).forEach(function(k) { delete mapa[k].orden; });
  return mapa;
}

// Modelo de costos compartido por Productos y Subrecetas: recetas, precios de insumos y rendimientos.
function _modeloCostos(fechaCorte) {
  var ss = getSpreadsheet();
  var sheetR = ss.getSheetByName('Recetas');
  // ── PUNTO 7: pasar fechaCorte a getPreciosUltimaCompra ──
  var preciosCompra = getPreciosUltimaCompra(fechaCorte || null);
  var rendimientos  = getRendimientosSubrecetas();

  var recetasPorProducto = {};
  if (sheetR && sheetR.getLastRow() > 1) {
    var dataR = sheetR.getDataRange().getValues();
    dataR.slice(1).forEach(function(row, idx) {
      var prod   = String(row[0] || '').trim().toUpperCase();
      var insumo = String(row[1] || '').trim().toUpperCase();
      var cant   = parseFloat(row[2]) || 0;
      var unidad = String(row[3] || '').trim();
      var esSub  = String(row[4] || '').trim().toUpperCase() === 'SI';
      if (!prod || !insumo) return;
      if (!recetasPorProducto[prod]) recetasPorProducto[prod] = [];
      recetasPorProducto[prod].push({ insumo:insumo, cantidad:cant, unidad:unidad, esSubreceta:esSub, _rowIndex:idx+2 });
    });
  }

  function calcularCosto(nombreProducto, visitados) {
    visitados = visitados || {};
    if (visitados[nombreProducto]) return 0;
    visitados[nombreProducto] = true;
    var ing = recetasPorProducto[nombreProducto] || [];
    var total = 0;
    ing.forEach(function(i) {
      if (i.esSubreceta) {
        var costoBatch = calcularCosto(i.insumo, JSON.parse(JSON.stringify(visitados)));
        var rinde = rendimientos[i.insumo.toUpperCase()] || 1;
        var costoUnitSub = costoBatch / rinde;
        total += costoUnitSub * i.cantidad;
      } else {
        var ref = preciosCompra[i.insumo];
        total += (ref ? ref.precioUnit : 0) * i.cantidad;
      }
    });
    return total;
  }

  function enriquecerIngredientes(nombre, visitados) {
    visitados = visitados || {};
    if (visitados[nombre]) return [];
    visitados[nombre] = true;
    var ing = recetasPorProducto[nombre] || [];
    return ing.map(function(i) {
      var costoUnit = 0, costoLinea = 0;
      if (i.esSubreceta) {
        var costoBatch = calcularCosto(i.insumo, JSON.parse(JSON.stringify(visitados)));
        var rinde = rendimientos[i.insumo.toUpperCase()] || 1;
        costoUnit  = Math.round((costoBatch / rinde) * 10) / 10;
        costoLinea = Math.round(costoUnit * i.cantidad * 10) / 10;
      } else {
        var ref = preciosCompra[i.insumo];
        costoUnit  = ref ? ref.precioUnit : 0;
        costoLinea = Math.round(costoUnit * i.cantidad * 10) / 10;
      }
      return {
        insumo: i.insumo, cantidad: i.cantidad, unidad: i.unidad,
        esSubreceta: i.esSubreceta, _rowIndex: i._rowIndex,
        costoUnit: costoUnit, costoLinea: costoLinea,
        sinPrecio: costoUnit === 0 && !i.esSubreceta
      };
    });
  }

  return { calcularCosto: calcularCosto, enriquecerIngredientes: enriquecerIngredientes,
           rendimientos: rendimientos, recetasPorProducto: recetasPorProducto };
}

function getProductos(fechaCorte) {
  var ss = getSpreadsheet();
  var sheetP = ss.getSheetByName('Productos');
  if (!sheetP || sheetP.getLastRow() <= 1) return [];
  var modelo = _modeloCostos(fechaCorte);
  var calcularCosto = modelo.calcularCosto, enriquecerIngredientes = modelo.enriquecerIngredientes;
  var preciosVenta  = getPreciosUltimaVenta();

  var dataP = sheetP.getDataRange().getValues();
  var headersP = dataP[0];
  var colNombre   = headersP.indexOf('Nombre');
  var colRubro    = headersP.indexOf('Rubro');
  var colEnCarta  = headersP.indexOf('EnCarta');
  var colPrecioV  = headersP.indexOf('PrecioVenta');
  var colFoodCost = headersP.indexOf('FoodCostTarget');

  return dataP.slice(1).filter(function(r){ return r[colNombre]; }).map(function(row, idx) {
    var nombre   = String(row[colNombre] || '').trim().toUpperCase();
    var rubro    = String(row[colRubro]  || '').trim();
    var enCarta  = String(row[colEnCarta]|| '').trim().toUpperCase() === 'SI';
    var precioVentaSheet  = parseFloat(row[colPrecioV]) || 0;
    var foodCostTarget    = parseFloat(row[colFoodCost]) || 30;

    var ventaRef    = preciosVenta[nombre];
    var precioVenta = ventaRef ? ventaRef.precio : precioVentaSheet;
    var costoCalculado = calcularCosto(nombre, {});
    var foodCostReal = precioVenta > 0 ? (costoCalculado / precioVenta) * 100 : 0;
    var margen       = precioVenta > 0 ? precioVenta - costoCalculado : 0;
    var margenPct    = precioVenta > 0 ? ((precioVenta - costoCalculado) / precioVenta) * 100 : 0;

    return {
      _rowIndex: idx + 2,
      nombre: nombre, rubro: rubro, enCarta: enCarta,
      precioVenta: precioVenta, precioVentaSheet: precioVentaSheet,
      costoCalculado: Math.round(costoCalculado * 10) / 10,
      foodCostReal: Math.round(foodCostReal * 10) / 10,
      foodCostTarget: foodCostTarget,
      margen: Math.round(margen),
      margenPct: Math.round(margenPct * 10) / 10,
      precioSugerido: foodCostTarget > 0 ? Math.round(costoCalculado / (foodCostTarget/100)) : 0,
      fuentePrecio: ventaRef ? ('ventas/' + ventaRef.mes) : 'manual',
      ingredientes: enriquecerIngredientes(nombre, {})
    };
  });
}

function getAnalisisMarginal() {
  var productos = getProductos();
  var activos = productos.filter(function(p) { return p.enCarta && p.precioVenta > 0; });
  activos.sort(function(a, b) { return b.margenPct - a.margenPct; });
  return { productos: activos, total: activos.length };
}

function registrarProducto(data) {
  var sheet = getSpreadsheet().getSheetByName('Productos');
  if (!sheet) return { ok: false, msg: 'Hoja Productos no encontrada' };
  var rows = sheet.getDataRange().getValues();
  var existe = rows.slice(1).some(function(r) {
    return String(r[0]).trim().toUpperCase() === String(data.nombre).trim().toUpperCase();
  });
  if (existe) return { ok: false, msg: 'El producto ya existe' };
  var hoy = new Date().toLocaleDateString('es-AR');
  sheet.appendRow([String(data.nombre).trim().toUpperCase(), data.rubro||'Otros',
    data.enCarta ? 'SI' : 'NO', parseFloat(data.precioVenta)||0, parseFloat(data.foodCostTarget)||30, hoy]);
  return { ok: true };
}

function editarProducto(data) {
  var sheet = getSpreadsheet().getSheetByName('Productos');
  if (!sheet) return { ok: false };
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim().toUpperCase() === String(data.nombre).trim().toUpperCase()) {
      if (data.rubro          !== undefined) sheet.getRange(i+1, 2).setValue(data.rubro);
      if (data.enCarta        !== undefined) sheet.getRange(i+1, 3).setValue(data.enCarta ? 'SI' : 'NO');
      if (data.precioVenta    !== undefined) sheet.getRange(i+1, 4).setValue(parseFloat(data.precioVenta)||0);
      if (data.foodCostTarget !== undefined) sheet.getRange(i+1, 5).setValue(parseFloat(data.foodCostTarget)||30);
      return { ok: true };
    }
  }
  return { ok: false, msg: 'Producto no encontrado' };
}

function eliminarProducto(nombre) {
  var ss = getSpreadsheet();
  var sheetP = ss.getSheetByName('Productos');
  var sheetR = ss.getSheetByName('Recetas');
  var nombreUp = String(nombre).trim().toUpperCase();
  var borradoProd = false, borradasRec = 0;
  if (sheetP && sheetP.getLastRow() > 1) {
    var rowsP = sheetP.getDataRange().getValues();
    for (var i = rowsP.length - 1; i >= 1; i--) {
      if (String(rowsP[i][0]).trim().toUpperCase() === nombreUp) { sheetP.deleteRow(i+1); borradoProd=true; break; }
    }
  }
  if (sheetR && sheetR.getLastRow() > 1) {
    var rowsR = sheetR.getDataRange().getValues();
    for (var j = rowsR.length - 1; j >= 1; j--) {
      if (String(rowsR[j][0]).trim().toUpperCase() === nombreUp) { sheetR.deleteRow(j+1); borradasRec++; }
    }
  }
  return { ok: borradoProd, borradasRec: borradasRec };
}

function agregarIngrediente(data) {
  var sheet = getSpreadsheet().getSheetByName('Recetas');
  if (!sheet) return { ok: false };
  sheet.appendRow([String(data.producto).trim().toUpperCase(), String(data.insumo).trim().toUpperCase(),
    parseFloat(data.cantidad)||0, data.unidad||'', data.esSubreceta ? 'SI' : 'NO']);
  return { ok: true };
}

function eliminarIngrediente(data) {
  var sheet = getSpreadsheet().getSheetByName('Recetas');
  if (!sheet) return { ok: false };
  var ri = parseInt(data.rowIndex);
  if (!ri || ri < 2 || ri > sheet.getLastRow()) return { ok: false, msg: 'Fila inválida' };
  sheet.deleteRow(ri);
  return { ok: true };
}

function actualizarIngrediente(data) {
  var sheet = getSpreadsheet().getSheetByName('Recetas');
  if (!sheet) return { ok: false };
  var ri = parseInt(data.rowIndex);
  if (!ri || ri < 2) return { ok: false };
  if (data.cantidad !== undefined && data.cantidad !== null) sheet.getRange(ri, 3).setValue(parseFloat(data.cantidad)||0);
  if (data.unidad   !== undefined && data.unidad   !== null) sheet.getRange(ri, 4).setValue(data.unidad);
  return { ok: true };
}

// ============================================================
// PRECIOS DE REFERENCIA (PreciosBase)
// ============================================================

function getPreciosBase() {
  var sheet = getSpreadsheet().getSheetByName('PreciosBase');
  if (!sheet || sheet.getLastRow() <= 1) return [];
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var colInsumo = headers.indexOf('Insumo');
  var colPrecio = headers.indexOf('PrecioUnit');
  var colUnidad = headers.indexOf('Unidad');
  var colNotas  = headers.indexOf('Notas');
  if (colInsumo < 0) colInsumo = 0;
  if (colPrecio < 0) colPrecio = 1;
  if (colUnidad < 0) colUnidad = 2;
  if (colNotas  < 0) colNotas  = 3;
  return data.slice(1).filter(function(r) { return r[colInsumo]; }).map(function(r, idx) {
    return {
      _rowIndex: idx + 2,
      insumo:    String(r[colInsumo] || '').trim().toUpperCase(),
      precioUnit: parseFloat(r[colPrecio]) || 0,
      unidad:    String(r[colUnidad] || '').trim(),
      notas:     String(r[colNotas]  || '').trim()
    };
  });
}

function guardarPrecioBase(data) {
  var sheet = getSpreadsheet().getSheetByName('PreciosBase');
  if (!sheet) return { ok: false, msg: 'Hoja PreciosBase no encontrada.' };
  var insumoUp = String(data.insumo || '').trim().toUpperCase();
  if (!insumoUp) return { ok: false, msg: 'Insumo requerido' };
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim().toUpperCase() === insumoUp) {
      sheet.getRange(i + 1, 2).setValue(parseFloat(data.precioUnit) || 0);
      sheet.getRange(i + 1, 3).setValue(data.unidad || '');
      sheet.getRange(i + 1, 4).setValue(data.notas  || '');
      return { ok: true, accion: 'actualizado' };
    }
  }
  sheet.appendRow([insumoUp, parseFloat(data.precioUnit) || 0, data.unidad || '', data.notas || '']);
  return { ok: true, accion: 'creado' };
}

function eliminarPrecioBase(insumo) {
  var sheet = getSpreadsheet().getSheetByName('PreciosBase');
  if (!sheet || sheet.getLastRow() <= 1) return { ok: false, msg: 'Hoja PreciosBase vacía' };
  var insumoUp = String(insumo || '').trim().toUpperCase();
  var rows = sheet.getDataRange().getValues();
  for (var i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][0]).trim().toUpperCase() === insumoUp) {
      sheet.deleteRow(i + 1);
      return { ok: true };
    }
  }
  return { ok: false, msg: 'Insumo no encontrado' };
}

// ============================================================
// INSUMOS — fuente única de verdad
// ============================================================
function getInsumos() {
  var sheet = getSpreadsheet().getSheetByName('Insumos');
  if (!sheet || sheet.getLastRow() <= 1) return [];
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var colNombre   = headers.indexOf('Nombre');
  var colUnidad   = headers.indexOf('Unidad');
  var colCat      = headers.indexOf('Categoria');
  if (colNombre < 0) colNombre = 0;
  if (colUnidad < 0) colUnidad = 1;
  if (colCat    < 0) colCat    = 2;
  return data.slice(1).filter(function(r){ return r[colNombre]; }).map(function(r, idx) {
    return {
      _rowIndex: idx + 2,
      nombre:    String(r[colNombre] || '').trim().toUpperCase(),
      unidad:    String(r[colUnidad] || '').trim(),
      categoria: String(r[colCat]    || '').trim()
    };
  }).sort(function(a, b){ return a.nombre.localeCompare(b.nombre); });
}

function agregarInsumo(data) {
  var sheet = getSpreadsheet().getSheetByName('Insumos');
  if (!sheet) return { ok: false, msg: 'Hoja Insumos no encontrada.' };
  var nombreUp = String(data.nombre || '').trim().toUpperCase();
  if (!nombreUp) return { ok: false, msg: 'Nombre requerido' };
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim().toUpperCase() === nombreUp) {
      sheet.getRange(i + 1, 2).setValue(data.unidad    || '');
      sheet.getRange(i + 1, 3).setValue(data.categoria || '');
      return { ok: true, accion: 'actualizado' };
    }
  }
  sheet.appendRow([nombreUp, data.unidad || '', data.categoria || '']);
  return { ok: true, accion: 'creado' };
}

function eliminarInsumo(nombre) {
  var sheet = getSpreadsheet().getSheetByName('Insumos');
  if (!sheet || sheet.getLastRow() <= 1) return { ok: false, msg: 'Hoja Insumos vacía' };
  var nombreUp = String(nombre || '').trim().toUpperCase();
  var rows = sheet.getDataRange().getValues();
  for (var i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][0]).trim().toUpperCase() === nombreUp) {
      sheet.deleteRow(i + 1);
      return { ok: true };
    }
  }
  return { ok: false, msg: 'Insumo no encontrado' };
}

// ============================================================
// SUBRECETAS — rendimientos batch
// ============================================================
function getRendimientosSubrecetas() {
  var sheet = getSpreadsheet().getSheetByName('Subrecetas');
  if (!sheet || sheet.getLastRow() <= 1) return {};
  var data = sheet.getDataRange().getValues();
  var mapa = {};
  data.slice(1).forEach(function(row) {
    var nombre = String(row[0] || '').trim().toUpperCase();
    var rinde  = parseFloat(row[1]) || 1;
    if (nombre) mapa[nombre] = rinde;
  });
  return mapa;
}

// ============================================================
// SUBRECETAS — listado completo con rendimiento
// ============================================================
// Subrecetas con su receta y costos: costo de la tanda (suma de ingredientes) y costo unitario (÷ rendimiento).
function getSubrecetasCompleto() {
  var sheet = getSpreadsheet().getSheetByName('Subrecetas');
  if (!sheet || sheet.getLastRow() <= 1) return [];
  var data = sheet.getDataRange().getValues();
  var modelo = _modeloCostos(null);
  return data.slice(1).filter(function(r){ return r[0]; }).map(function(r, idx) {
    var nombre = String(r[0] || '').trim();
    var nombreUp = nombre.toUpperCase();
    var rendimiento = parseFloat(r[1]) || 1;
    var costoTanda = modelo.calcularCosto(nombreUp, {});
    return {
      _rowIndex:     idx + 2,
      nombre:        nombre,
      rendimiento:   rendimiento,
      unidad:        String(r[2] || '').trim(),
      costoTanda:    Math.round(costoTanda * 10) / 10,
      costoUnitario: Math.round((costoTanda / rendimiento) * 100) / 100,
      ingredientes:  modelo.enriquecerIngredientes(nombreUp, {})
    };
  }).sort(function(a, b){ return a.nombre.localeCompare(b.nombre); });
}

// Alta de una subreceta nueva (sin ingredientes; se cargan después desde la app).
function agregarSubreceta(data) {
  var sheet = getSpreadsheet().getSheetByName('Subrecetas');
  if (!sheet) return { ok: false, msg: 'Hoja Subrecetas no encontrada' };
  var nombreUp = String(data.nombre || '').trim().toUpperCase();
  if (!nombreUp) return { ok: false, msg: 'Nombre requerido' };
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0] || '').trim().toUpperCase() === nombreUp) return { ok: false, msg: 'Ya existe una subreceta con ese nombre' };
  }
  sheet.appendRow([nombreUp, parseFloat(data.rendimiento) || 1, data.unidad || 'UNIDAD']);
  return { ok: true, nombre: nombreUp };
}

function actualizarSubreceta(data) {
  var sheet = getSpreadsheet().getSheetByName('Subrecetas');
  if (!sheet || sheet.getLastRow() <= 1) return { ok: false, msg: 'Hoja Subrecetas no encontrada' };
  var nombreUp = String(data.nombre || '').trim().toUpperCase();
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0] || '').trim().toUpperCase() === nombreUp) {
      if (data.rendimiento !== undefined) sheet.getRange(i + 1, 2).setValue(parseFloat(data.rendimiento) || 1);
      if (data.unidad      !== undefined) sheet.getRange(i + 1, 3).setValue(data.unidad);
      return { ok: true };
    }
  }
  return { ok: false, msg: 'Subreceta no encontrada: ' + data.nombre };
}

// ============================================================
// FORMACIÓN DE PRECIOS — parámetros de impuestos y canales de venta
// ============================================================
// Hoja ParametrosVenta: Clave | Valor | Descripción   (porcentajes, ej. 3.5 = 3,5%)
// Hoja CanalesVenta:    Canal | ComisionPct | BaseComision | DescuentoPct | Referencia | Activo
//   BaseComision: FINAL (sobre el precio con IVA) o NETO (sobre el precio sin IVA). La comisión se toma neta de su propio IVA.
//   Referencia:   si tiene un canal, el precio sale de ese canal menos DescuentoPct (ej. Efectivo = Mercado Pago − 10%).
var PV_PARAMETROS_DEFECTO = [
  ['IVA', 21, 'IVA débito fiscal (%)'],
  ['IIBB', 3.5, 'Ingresos Brutos sobre el precio neto de IVA (%)'],
  ['SEG_HIGIENE', 1, 'Tasa de Seguridad e Higiene sobre el precio neto de IVA (%)'],
  ['COSTO_OBJETIVO', 30, 'Costo de venta (producción + IIBB + SeH + comisión) como % del precio neto de IVA'],
  ['INICIO_FACTURACION', 202611, 'Año y mes (AAAAMM) desde el que se factura: desde ese mes las ventas se toman netas de IVA y generan IIBB y SeH en los reportes']
];

// Tasas que se aplican a las ventas de un mes: antes del inicio de la facturación, ninguna.
function _tasasFiscales(par, anio, mes) {
  var inicio = parseInt(par.INICIO_FACTURACION, 10) || 0;
  if (!inicio || (anio * 100 + mes) < inicio) return { iva: 0, iibb: 0, seh: 0, activo: false };
  return { iva: (parseFloat(par.IVA) || 0) / 100, iibb: (parseFloat(par.IIBB) || 0) / 100,
           seh: (parseFloat(par.SEG_HIGIENE) || 0) / 100, activo: true };
}
var PV_CANALES_DEFECTO = [
  ['Mercado Pago', '', 'FINAL', 0, '', 'SI'],
  ['Rappi',        '', 'FINAL', 0, '', 'SI'],
  ['PedidosYa',    '', 'FINAL', 0, '', 'SI'],
  ['Efectivo',     0,  'FINAL', 10, 'Mercado Pago', 'SI']
];

function _pvHoja(nombre, headers, filasDefecto) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(nombre);
  if (!sheet) {
    sheet = ss.insertSheet(nombre);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#233f20').setFontColor('#fcebca');
    sheet.setFrozenRows(1);
    if (filasDefecto.length) sheet.getRange(2, 1, filasDefecto.length, headers.length).setValues(filasDefecto);
  }
  return sheet;
}
function _pvNum(v) {
  if (v === '' || v === null || v === undefined) return null;
  var n = parseFloat(String(v).replace(',', '.'));
  return isNaN(n) ? null : n;
}

function getParametrosVenta() {
  var sP = _pvHoja('ParametrosVenta', ['Clave', 'Valor', 'Descripcion'], PV_PARAMETROS_DEFECTO);
  var sC = _pvHoja('CanalesVenta', ['Canal', 'ComisionPct', 'BaseComision', 'DescuentoPct', 'Referencia', 'Activo'], PV_CANALES_DEFECTO);
  var parametros = {};
  PV_PARAMETROS_DEFECTO.forEach(function(d) { parametros[d[0]] = d[1]; });
  if (sP.getLastRow() > 1) {
    sP.getRange(2, 1, sP.getLastRow() - 1, 2).getValues().forEach(function(r) {
      var k = String(r[0] || '').trim().toUpperCase();
      var v = _pvNum(r[1]);
      if (k && v !== null) parametros[k] = v;
    });
  }
  var canales = [];
  if (sC.getLastRow() > 1) {
    sC.getRange(2, 1, sC.getLastRow() - 1, 6).getValues().forEach(function(r) {
      var nombre = String(r[0] || '').trim();
      if (!nombre) return;
      canales.push({
        canal:        nombre,
        comisionPct:  _pvNum(r[1]),                       // null = a confirmar
        baseComision: String(r[2] || 'FINAL').trim().toUpperCase() === 'NETO' ? 'NETO' : 'FINAL',
        descuentoPct: _pvNum(r[3]) || 0,
        referencia:   String(r[4] || '').trim(),
        activo:       String(r[5] || 'SI').trim().toUpperCase() !== 'NO'
      });
    });
  }
  return { parametros: parametros, canales: canales };
}

// data: { parametros: {IVA, IIBB, SEG_HIGIENE, COSTO_OBJETIVO}, canales: [{canal, comisionPct, baseComision, descuentoPct, referencia, activo}] }
function guardarParametrosVenta(data) {
  return _vConLock(function() {
    var sP = _pvHoja('ParametrosVenta', ['Clave', 'Valor', 'Descripcion'], PV_PARAMETROS_DEFECTO);
    var sC = _pvHoja('CanalesVenta', ['Canal', 'ComisionPct', 'BaseComision', 'DescuentoPct', 'Referencia', 'Activo'], PV_CANALES_DEFECTO);
    var par = data.parametros || {};
    var filasP = PV_PARAMETROS_DEFECTO.map(function(d) {
      var v = _pvNum(par[d[0]]);
      return [d[0], v === null ? d[1] : v, d[2]];
    });
    if (sP.getLastRow() > 1) sP.getRange(2, 1, sP.getLastRow() - 1, 3).clearContent();
    sP.getRange(2, 1, filasP.length, 3).setValues(filasP);

    var filasC = (data.canales || []).filter(function(c){ return c && String(c.canal || '').trim(); }).map(function(c) {
      var com = _pvNum(c.comisionPct);
      return [String(c.canal).trim(), com === null ? '' : com,
              String(c.baseComision || 'FINAL').toUpperCase() === 'NETO' ? 'NETO' : 'FINAL',
              _pvNum(c.descuentoPct) || 0, String(c.referencia || '').trim(), c.activo === false ? 'NO' : 'SI'];
    });
    if (sC.getLastRow() > 1) sC.getRange(2, 1, sC.getLastRow() - 1, 6).clearContent();
    if (filasC.length) sC.getRange(2, 1, filasC.length, 6).setValues(filasC);
    return { ok: true };
  });
}

// ============================================================
// FUNCIONES DE INICIALIZACIÓN (ejecutar una sola vez)
// ============================================================
function crearHojaPreciosBase() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('PreciosBase');
  if (sheet) { Logger.log('La hoja PreciosBase ya existe.'); return; }
  sheet = ss.insertSheet('PreciosBase');
  var headers = ['Insumo', 'PrecioUnit', 'Unidad', 'Notas'];
  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#233f20').setFontColor('#fcebca');
  sheet.setFrozenRows(1);
  Logger.log('Hoja PreciosBase creada correctamente.');
}

function normalizarRecetas() {
  var ss = getSpreadsheet();
  var sheetR = ss.getSheetByName('Recetas');
  if (!sheetR || sheetR.getLastRow() <= 1) { Logger.log('Hoja Recetas vacía'); return; }
  var CORRECCIONES = {
    'SALSA DE TOMATE ITALIANA PIZZA': 'SALSA DE TOMATE ITALIANA',
    'SALSA DE TOMATE NACIONAL PIZZA': 'SALSA DE TOMATE NACIONAL',
    'QUESO REGGGIANITO': 'QUESO REGGIANITO',
    'TOMATES HIDRATADOS': 'TOMATES DESHIDRATADOS',
    'CIRUELA HIDRATADA': 'CIRUELA DESHIDRATADA',
    'MORRON ASADO': 'MORRON',
    'ACEITE DE AJO': 'AJO',
  };
  var data = sheetR.getDataRange().getValues();
  var headers = data[0];
  var colInsumo = headers.indexOf('Insumo');
  if (colInsumo < 0) colInsumo = 1;
  var corregidos = 0;
  for (var i = 1; i < data.length; i++) {
    var insumoActual = String(data[i][colInsumo] || '').trim().toUpperCase();
    if (CORRECCIONES[insumoActual] && CORRECCIONES[insumoActual] !== insumoActual) {
      sheetR.getRange(i + 1, colInsumo + 1).setValue(CORRECCIONES[insumoActual]);
      corregidos++;
    }
  }
  Logger.log('✅ ' + corregidos + ' nombres corregidos en Recetas.');
}