(function(AB) {
	
	'use strict';
	
	AB.IDBConnector = {};

	var	DB_Name 		  = 'Adress Book',
		  dbVer 			  = 1,
		  Store_NAME 		= 'Contacts',
		  db, keyPath 	= 1;

	AB.IDBConnector.createStore = function (cfg) {

		var req = indexedDB.open(DB_Name, dbVer),
			primaryKey = cfg.primaryKey || null; 

		req.onupgradeneeded = function (evt) {
			
			var store,
				db = evt.target.result;	
			
			if(db.objectStoreNames.contains(Store_NAME)) {
	        	var storeReq = db.deleteObjectStore(Store_NAME);
	    }

    	store = db.createObjectStore(Store_NAME, {keyPath: primaryKey});

      store.createIndex('by_groups', 'Group');

   	};

       	req.onsuccess = function (evt) {
       		var db = evt.target.result;
       		db.close();

       	};

       	req.onerror = function (evt) {
       		AB.IDBConnector.ManagerException(this.errorCode); 

       	}; 

       	var _addImplementation = function (data, callback) {

       		_getUniqKey(primaryKey, data, insertData);

       		function insertData (data) {
	       		var req = indexedDB.open(DB_Name, dbVer);
	       		
	       		req.onsuccess = function (evt) {
	       			var db = evt.target.result,
	       				req = db.transaction([Store_NAME], _getDefaultTransaction())
	       							.objectStore(Store_NAME)
	       								.put(data);
	       			
	       			req.onsuccess = function (evt) {
	       				db.close();
	       				callback();
	       			};

	       			req.onerror = function (evt) {
	       				AB.IDBConnector.ManagerException(this.errorCode);
	       				console.log("Error Adding: ", e);	
	       			};

	       		};

	   			req.onerror = function (evt) {

	   				AB.IDBConnector.ManagerException(this.errorCode);	
	   				console.log("Error Adding: ", e);
	   			};

   			  }

       	};

       	var _getAllImplementation = function (callback) {
       		
       		var req = indexedDB.open(DB_Name, dbVer);
       		
       		req.onsuccess = function (evt) {
       			var db = evt.target.result, data = [],
       				req = db.transaction([Store_NAME], _getDefaultTransaction())
       							.objectStore(Store_NAME)
       								.openCursor();
       			
       			req.onsuccess = function (evt) {
    					var result = evt.target.result;
    							
    					if (result) {
    						data.push(result.value);
    						result.continue();
    					}
    					else {
    						callback(data);
    					}

           		db.close();       				       				    				
       			};

       			req.onerror = function (evt) {
       				AB.IDBConnector.ManagerException(this.errorCode);
       				console.log("Error Adding: ", e);	
       			};
       		};

     			req.onerror = function (evt) {

     				AB.IDBConnector.ManagerException(this.errorCode);	
     				console.log("Error Adding: ", e);
     			};
       	};

       	var _deleteImplementation = function (id, callback) {

       		var req = indexedDB.open(DB_Name, dbVer);
       		
       		req.onsuccess = function (evt) {
       			var db = evt.target.result,
       				  req = db.transaction([Store_NAME], _getDefaultTransaction())
       							  .objectStore(Store_NAME)
       								.delete(id);
       			
       			req.onsuccess = function (evt) {
       				db.close();
       				callback();
       			};

       			req.onerror = function (evt) {
       				AB.IDBConnector.ManagerException(this.errorCode);
       				console.log("Error Adding: ", e);	
       			};

       		};

     			req.onerror = function (evt) {

     				AB.IDBConnector.ManagerException(this.errorCode);	
     				console.log("Error Adding: ", e);
     			};

       	}; 

        var _updateContactImplementation = function (id, data, callback) {
          var req = indexedDB.open(DB_Name, dbVer); 
              data.ID = id;

          req.onsuccess = function (evt) {
            var db = evt.target.result,
                req = db.transaction([Store_NAME], _getDefaultTransaction())
                      .objectStore(Store_NAME)
                      .openCursor(id);
            
            req.onsuccess = function (evt) {
              var cursor = event.target.result,
                  updateRequest;

              updateRequest = cursor.update(data);

              updateRequest.onsuccess = function (evt) {
                db.close();
                callback();
              };

              updateRequest.onerror = updateRequest.onblocked = function () {
                console.log('Error updating');
              };

            }; 

          };

          req.onerror = function (evt) {

            AB.IDBConnector.ManagerException(this.errorCode); 
            console.log("Error Adding: ", e);
          };

        }; 

        var _updateGroupsImplementation = function(oldGroupNmae, newGroupName, callback) {

        };     	

       	return {

       			addContact 	  	: _addImplementation,
       			deleteContact 	: _deleteImplementation,
       			getAll 			    : _getAllImplementation,
            updateContact   : _updateContactImplementation,
            updateGroups    : _updateGroupsImplementation

       	}
	};



	AB.IDBConnector.ManagerException = function (error) {
 
	};
	
	var _getDefaultTransaction = function (mode) {
		var result = null;
		switch (mode) {
			case "readwrite":
			case "readonly":
				result = mode;
				break;
			default:
				result = "readwrite";
		}
		return result;
	};

	var _getUniqKey = function (key, data, callback) {

		var req = indexedDB.open(DB_Name, dbVer);

		req.onsuccess = function (evt) {
   			var db = evt.target.result,
   				req = db.transaction([Store_NAME], _getDefaultTransaction())
   							.objectStore(Store_NAME)
   								.openCursor(null, 'prevunique');

   			req.onsuccess = function (evt) {		    		
   				 
   				db.close();

   				data[key] = 1 + (this.result ? this.result.primaryKey : null);	
   				callback(data); 				
   			};

   			req.onerror = function (evt) {
   				AB.IDBConnector.ManagerException(this.errorCode);
   				console.log("Error Adding: ", e);	
   			};   											
		};

		req.onerror = function (evt) {

   			AB.IDBConnector.ManagerException(this.errorCode);	
   			console.log("Error Adding: ", e);
   		};
	};

})(ADRESS_BOOK);