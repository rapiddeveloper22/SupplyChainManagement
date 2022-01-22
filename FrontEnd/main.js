let Id;
let accounts;
let contract;
let type;

const getContract = async(web3) => {
    const supp = await $.getJSON('../Supply.json');


    const netId = await web3.eth.net.getId();
 
    const deployedNetwork = supp.networks[netId];
    const supply = new web3.eth.Contract(
        supp.abi,
        deployedNetwork && deployedNetwork.address
    );
    
    return supply;
};

const getWeb3 = () => {
  return new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // ask user permission to access his accounts
          
          await window.ethereum.request({ method: "eth_requestAccounts" });
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      } else {
        reject("Must install MetaMask");
      }
    });
  });
  
};


let RegisterInformation = async() => {

    $("#btn").on("click", async(e) => {
        e.preventDefault();
        let name = $("#name").val();
        let email = $("#email").val();
        let password = $("#password").val();
        let type = $("#type").val();
        let Id;

        if(type === "Manufacturer") {
            await contract.methods.AddManufacturer(name, email, password).send({from : accounts[0]});
            Id = await contract.methods.GetIdOfManufacturer().call();
        }
        else if(type === "User") {
            console.log(accounts[0]);
            await contract.methods.AddUser(name, email, password).send({from : accounts[0]});

            Id = await contract.methods.GetIdOfUser().call();
            // Id = UserId;
        }
        console.log(Id);
        alert("Successfully Registered. Your id id "+ Id);
    });    
};

let AddMobile = async() => {

    $("#addmobile").on("click", async(e) => {
        e.preventDefault();
        let MobileName = $("#modelname").val();
        let ManufacturerName = $("#manufacturername").val();
        let OwnerId = $("#ownerid").val();
        let IMEINumber = $("#imeinumber").val();

        await contract.methods.AddMobile(MobileName, ManufacturerName, "Manufacturer", OwnerId, IMEINumber).send({from : accounts[0]});
        let MobileIdd = await contract.methods.GetIdOfMobile(IMEINumber).call();

        $(".result").append("<h3>Id of added mobile is "+ MobileIdd + "</h3>");

    });
};

let trackwhole = async() => {
    $("#whole").on("click", async(e) => {
        e.preventDefault();
        let idtobeknown = $("#history").val();
        let totalarray = await contract.methods.GetLengthOfArray(idtobeknown).call();
        $(".result").append("<div class='tbl-header'><table cellpadding='0' cellspacing='0' border='0'><thead><tr><th>S.No</th><th>Previous Owner Id</th><th>Previous Owner Type</th><th>New Owner Id</th><th>New Owner Type</th></tr></thead></table></div>");
        $(".result").append("<div class='tbl-content'><table id='too' cellpadding='0' cellspacing='0' border='0'><tbody>")
        for(var i = 0; i < totalarray; i++) {
            let ret = await contract.methods.GetMobileOwnershipTracking(idtobeknown, i).call();

            $("#too").append("<tr><td>" + (i+1) + "</td><td>" + ret[0] + "</td><td>" + ret[3] + "</td><td>" + ret[1] + "</td><td>" + ret[2] + "</td></tr>");
        }
        $(".result").append("</tbody></table></div>");
    });
};

let login = async() => {

    $("#btn3").on("click", async(e) => {
        e.preventDefault();
        let loginemail = $("#loginemail").val();
        let loginpassword = $("#loginpassword").val();
        let userid = $("#userid").val();
        let usertype = $("#type2").val();
        let allow = await contract.methods.VerifyLogin(loginpassword, userid, usertype).call();

        if(allow == true) {
            if(usertype == "Manufacturer") {
                window.location.replace('manufacturer/manufacturer.html');
                document.cookie = "type=0;path=/";
                $("#remove").remove();
                type=0;
            }
            else if(usertype == "User") {
                window.location.replace('user/user.html');
                document.cookie = "type=1;path=/";
                $("#remove").remove();
                type = 1;
            }
        }

        else {
            alert("Invalid login credentials");
        }
    });


};


let Findmobile = async() => {

    $("#findmobile").on("click", async(e) => {
        $(".result").empty();
        let mobileid = $("#mobileid").val();
        let totalmobile = await contract.methods.GetTotalMobile().call();
        if(mobileid < totalmobile)
        {
            let findmobile = await contract.methods.GetMobile(mobileid).call();

            $(".result").append("<h3 class='resultin'>Search Results</h3><p>Model Name : " + findmobile[0] + "</p><p>Manufacturer Name : " + 
                findmobile[1] + "</p><p>Owner Type : " + findmobile[2] + "</p><p>Owner Id : " + findmobile[3] + 
                "</p><p>Mobile Id : " + findmobile[4] + "</p><p>IMEI Number : " + findmobile[5] + "</p>");
        }
        else {
            $(".result").append("<h3>No such mobile with id " + mobileid + "</h3>");
        }
        
    });
};



let Finduser = async() => {

    $("#finduser").on("click", async(e) => {
        $(".result").empty();
        let userid = $("#userid").val();
        let totaluser = await contract.methods.GetTotalUser().call();
        if(userid < totaluser)
        {
            let finduser = await contract.methods.GetUser(userid).call();

            $(".result").append("<h3 class='resultin'>Search Results</h3><p>User Name : " + finduser[0] + "</p><p>User Email : " + 
                finduser[1] + "</p><p>User Id : " + finduser[2] + "</p>");
        }
        else {
            $(".result").append("<h3>No such user with id " + userid + "</h3>");
        }
        
    });
};




let Findmanufacturer = async() => {

    $("#findmanufacturer").on("click", async(e) => {
        $(".result").empty();
        let manufacturerid = $("#manufacturerid").val();
        let totalmanufacturer = await contract.methods.GetTotalManufacturer().call();
        if(manufacturerid < totalmanufacturer)
        {
            let findmanufacturer = await contract.methods.GetManufacturer(manufacturerid).call();

            $(".result").append("<h3 class='resultin'>Search Results</h3><p>Manufacturer Name : " + findmanufacturer[0] + "</p><p>Manufacturer Email : " + 
                findmanufacturer[1] + "</p><p>Manufacturer Id : " + findmanufacturer[2] + "</p>");
        }
        else {
            $(".result").append("<h3>No such manufacturer with id " + manufacturerid + "</h3>");
        }
        
    });
};




let transferOwner = async() => {

    $("#transfer").on("click", async(e) => {
        $(".result").empty();
        let previousownerid = $("#previousownerid").val();
        let newownerid = $("#newownerid").val();
        let previousownertype = $("#previousownertype").val();
        let newownertype = $("#Newownertype").val();
        let mmii = $("#transfermobileid").val();

        await contract.methods.TransferOwnership(previousownerid, newownerid, newownertype, mmii, previousownertype).send({from : accounts[0]});
    
        $(".result").append("<h3>Ownership Transferred</h3>");
    });
};


let trackusingmobileid = async() => {

    $("#trackusingid").on("click", async(e) => {
        $(".result").empty();

        let mid = $("#mid").val();
        let ono = $("#ono").val();

        let ret = await contract.methods.GetMobileOwnershipTracking(mid, ono).call();
        $(".result").append("<h3>Search Results</h3><p>Previous Owner Id : " + ret[0] + "</p><p>Previous Owner Type : " + ret[3] + "</p><p>New Owner Id : " + ret[1] + "</p><p>New Owner Type : " + ret[2] + "</p>");
    });
}

let trackusingimeinumber = async() => {

    $("#trackusingimeinumber").on("click", async(e) => {
        $(".result").empty();
        let imei = $("#imei").val();
        let onoo = $("#onoo").val();

        let idd = await contract.methods.GetIdOfMobile(imei).call();
        let ret = await contract.methods.GetMobileOwnershipTracking(idd, onoo).call();
        $(".result").append("<h3>Search Results</h3><p>Previous Owner Id : " + ret[0] + "</p><p>Previous Owner Type : " + ret[3] + "</p><p>New Owner Id : " + ret[1] + "</p><p>New Owner Type : " + ret[2] + "</p>");

    });
};

async function app() {
    const web3 = await getWeb3();
    accounts = await web3.eth.getAccounts();
    console.log(accounts);
    contract = await getContract(web3);
    console.log(contract);
    RegisterInformation(contract, accounts);
    AddMobile();
    login();
    transferOwner();
    Findmobile();
    Findmanufacturer();
    Finduser();
    trackwhole();
    trackusingmobileid();
    trackusingimeinumber();
}

app();



