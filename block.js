var web3;
var address = "0x6AF12ebE71E6E79dA9C4D59b3Fd13b85063eF28D";
async function Connect(){
    await window.web3.currentProvider.enable();
    web3 = new Web3(window.web3.currentProvider);
}
if(typeof web3 != 'undefined')
{
    web3 = new Web3(window.web3.currentProvider);
}
else{
     web3 = new Web3(new web3.HttpProvider("HTTP://127.0.0.1:7545"));

}

var abi= [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_token",
				"type": "string"
			}
		],
		"name": "addToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_token",
				"type": "string"
			}
		],
		"name": "isMappingObjectExists",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

 var contract  =  new  web3.eth.Contract(abi,address);

 function update(){
    var inputval = document.getElementById("id").value;
    var inputval = document.getElementById("token").value;
    web3.eth.getAccounts().then(function(account){
        return contract.method.addToken(id,token).send({from: account[0]});
    
    }).then(function(tmp){
            $("id").val("");
            $("token").val("");
    }).catch(function(){
        alert(tmp);
    })
 }

 function verify()
 {  var inputval2 = document.getElementById("ver").value;
     contract.methods.isMappingObjectExists(inputval2).then(function(state){
    $("#status").html(state);
     } )
 }