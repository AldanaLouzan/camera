// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
    tryingFile();
});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
})

//---Global Variables---//
var image;
var dataObj;
var fileEntryGlobal; 
var contentGlobal;

//Function which will be called by a button on the HTML in order to get a picture
function pics(){

    document.getElementById("myImag").style.display="none";     //It will hide any picture is displayed  
    navigator.camera.getPicture(cameraCallback, onError);
    
}

//---Success callback function---//
function cameraCallback(imageData){
    
    dataObj = new Blob([imageData], { type: 'image/png' }); //creates a new Blob 
    writeFile(imageData);   //invokes write function
    
}

function onError(msg){
    console.log(msg);
}

//---Creates a persistent file---//
function tryingFile(){

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemCallback, onError);
    
    }
    
    function fileSystemCallback(fs){
    
    // Name of the file I want to create
    var fileToCreate = "photo.png";
    
    // Opening/creating the file
    fs.root.getFile(fileToCreate, fileSystemOptionals, getFileCallback, onError);
    }
    
    var fileSystemOptionals = { create: true, exclusive: false };

    
    
    function getFileCallback(fileEntry){

        fileEntryGlobal = fileEntry;   
    
    }
    
    // We write on the file (store teh image taken)
    function writeFile(image) {      
       
    // Create a FileWriter object
    fileEntryGlobal.createWriter(function (fileWriter) {  
    
    //We store the object (image)    
    fileWriter.write(dataObj);
    
    fileWriter.onwriteend = function() {
                
                document.getElementById("success").innerHTML = "Your pic has been saved";
            };
    
    fileWriter.onerror = function (e) {
        document.getElementById("fail").innerHTML = "Own....please try again, that pic was awful anyway";
                
            };
    
        });
    }

    //---Function to show the picture---//
    function showPic(){       
    
    // Get the file from the file entry
    fileEntryGlobal.file(function (file) {
    
    // Create the reader
    var reader = new FileReader();
    reader.readAsText(file);
    
    reader.onloadend = function() {
                    
                console.log("Successful file read: " + this.result);
                console.log("file path: " + fileEntryGlobal.fullPath);
                contentGlobal = this.result;
                image = document.getElementById("myImag");
                image.src = contentGlobal;
                document.getElementById("myImag").style.display="initial";  
    
            };
    
        }, onError);
    }
    
    function onError(msg){
        console.log(msg);
    }