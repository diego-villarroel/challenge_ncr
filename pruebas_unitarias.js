let test_result_api = {cuentas:[],otro_dato:{dato_1:'1',dato_2:'2'}};
let test_array_account = [];
let test_account = {moneda:'$',tipo_letras:'CA',n:'872378326701',saldo:'1500'};
test_array_account.push(test_account);
test_result_api.cuentas = test_array_account;

QUnit.test('Prueba unitaria de test', function(assert){
    assert.notOk(undefined, typeof(app()));
    assert.notOk(undefined, typeof(appEvents()));
    assert.notOk(undefined, typeof(setContent(test_array_account)));
    assert.equal('string', typeof(setCardsContent(test_account)));
    // 
    assert.notEqual('int', typeof(app()));
    assert.notEqual('int', typeof(appEvents()));
    assert.notEqual('int', typeof(setContent(test_array_account)));
    assert.notEqual('int', typeof(setCardsContent(test_account)));
});
  