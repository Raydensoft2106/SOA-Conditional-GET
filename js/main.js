var rootURL = "http://localhost:4006/DiseasesApp/api/diseases";
var currentGame;
var reqStatus = "";

var d = new Date();
var n = d.toString();

$(document).ready(function(){
    findAll();
    //$(document).on("click","#tableBody a",function(){findById(this.id);});
    $(document).on("click","#deleteButton",function(){deleteDisease();});      
    $(document).on("click","#updateButton",function(){updateDisease();}); 
    $(document).on("click","#addButton",function(){addDisease();});
	$(document).on("click","#refreshButton",function() {findAll();});
 });

var findAll = function(){
    console.log("findAll - Working");
    $.ajax({
        type:'GET',
        url: rootURL,
        dataType: "json",
        ifModified: true,
        success: function(data, status, xhr) {
            document.getElementById('statusOnly').innerHTML = xhr.status + ' ' + xhr.statusText;

            document.getElementById('statusTime').innerHTML = '(Status: ' + xhr.status + ' ' + xhr.statusText +')\nLast Modified: ' + xhr.getResponseHeader("last-modified");
            if (xhr.status == 200) {
                renderTable(data);
            }
        },
        error: function(xhr, textStatus, errorThrown) {
            document.getElementById('statusOnly').innerHTML = xhr.status + ' ' + xhr.statusText;
        }
    });
};
        
function renderTable(data){
    console.log("renderTable");
    $('#tableBody tr').remove();
    list=data.disease;
    $.each(list, function(index,disease){
        $('#tableBody').append('<tr><td>'+disease.id+'</td><td>'+disease.name+'</td><td>'+disease.infected+'</td><td>'+disease.deathtoll+'</td><td>'+disease.timestamp+'</td></tr>');
     });
}
     
var findById = function(id){
    console.log("Hello there");
    console.log("findById Test");
    $.ajax({
        type:'GET',
        url: rootURL+'/'+id,
        dataType: "json",
        success: function(data, textStatus, jqXHR){
            $('#btnDelete').show();
            console.log("findById success - DiseaseID "+data.id);
            alert('Disease updated'+ "\nname: "+data.name
                                 					 + "\ninfected: "+data.infected
                                 					 + "\ndeathtoll: "+data.deathtoll
                                 					 + "\ntimestamp: "+data.timestamp
                                 					 + "\nStatus: "+reqStatus);
            document.getElementById('statusTime').innerHTML ="Status = "+reqStatus +"\nLast Modified " + data.timestamp + "GMT";
            document.getElementById('statusOnly').innerHTML ="Status = "+reqStatus;
            currentDisease = data;
            renderDetails(currentDisease);
        }

     });
};

var renderDetails = function(disease){
    $('#diseaseId').val(disease.id);
    $('#name').val(disease.name);
    $('#infected').val(disease.infected);
    $('#deathtoll').val(disease.deathtoll);
    $('#timestamp').val(disease.timestamp);
};

var deleteDisease=function() {
    console.log('deleteDisease');
    $.ajax({
        type: 'DELETE',
        url: rootURL + '/' + $('#diseaseId').val(),
        success: function(data, textStatus, jqXHR){
                 alert('Disease deleted successfully');
                 findAll();
        },
        error: function(jqXHR, textStatus, errorThrown){
                alert('deleteDisease error');
        }
    });
};

var updateDisease=function() {
    console.log('updateDisease');
    console.log("Updating This disease: "+ $('#diseaseId').val());
    console.log(JSON.stringify(formToJSONUpdate()));
    $.ajax({
            type: 'PUT',
            url: rootURL + '/' + $('#diseaseId').val(),
            dataType:"json",
            data:formToJSONUpdate(),
            success: function(data, textStatus, jqXHR){
//                     alert('Disease updated'+ "\nname: "+$('#name').val()
//                     					 + "\ninfected: "+$('#infected').val()
//                     					 + "\ndeathtoll: "+$('#deathtoll').val()
//                     					 + "\ntimestamp: "+Date.now()
//                     					 + "\nStatus: "+jqXHR.status);
                    findById($('#diseaseId').val());
                    reqStatus = jqXHR.status;
                    findAll();
            },
            error: function(jqXHR, textStatus, errorThrown){
                    alert('updateDisease error' + "\nStatus: "+jqXHR.status);
                    document.getElementById('statusOnly').innerHTML ="Status = "+jqXHR.status;
            }
    });
};
        
var formToJSONUpdate=function(){
    console.log('Converting to JSON-Update');
        return JSON.stringify({
			"id":$('#diseaseId').val(),
            "name":$('#name').val(),
            "infected":$('#infected').val(),
            "deathtoll":$('#deathtoll').val(),
        });
};
        
var formToJSONAdd=function(){
    console.log('Converting to JSON-Add');
    return JSON.stringify({
		"name":$('#addDiseaseName').val(),
		"infected":$('#addDiseaseInfected').val(),
		"deathtoll":$('#addDiseaseDeathtoll').val(),
		"timestamp":$('#timestamp').val(),
    });
};   
var addDisease=function() {
    console.log('addDisease');
    console.log(JSON.stringify(formToJSONAdd()));
    $.ajax({
            type: 'POST',
            url: rootURL,
            dataType:"json",
            data:formToJSONAdd(),
            success: function(data, textStatus, jqXHR){
                     alert('Disease added successfully'+ "\nname: "+$('#addDiseaseName').val()
					 + "\ninfected: "+$('#addDiseaseInfected').val()
					 + "\ndeathtoll: "+$('#addDiseaseDeathtoll').val()
					 + "\ntimestamp: "+n
					 + "\nStatus: "+jqXHR.status);
                     findAll();
            },
            error: function(jqXHR, textStatus, errorThrown){
                    alert('addDisease error: '+errorThrown + "\nStatus: "+jqXHR.status);
                    document.getElementById('statusOnly').innerHTML ="Status = "+jqXHR.status;
            }
    });
};