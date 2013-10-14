var ADRESS_BOOK = AB = {};

$(function() {

 'use strict';

  var store, dataContacts, dataGroups,
      uniqKey          = 'ID',
      
      //private function:
      _getAllContacts,
      _renderListOfContacts,
      _renderListOfGroups,
      _addListeners,
      _getInfoDOM,
      _fillEditForm,
      _getDataGroups,

      //work with DOM:
      body             = $('body'),
      btnSave          = $('#btnSave'),
      btnSearch        = $('#search'),
      btnAddGroup      = $('#addGroup'),
      btnCancelGroup   = $('#cancelGroup'),
      btnCancel        = $('#btnCancel'),
      groupList        = $('#group_list'),
      eitTitle         = $('#edit_title'),
      contactList      = $('#contact_list'), 
      groupDownList    = $('#groupDownList'),
      search_query     = $('#search_query'),   
      newGroupInput    = $('#newGroupInput'),
      groupsAccordion  = $('#group_container'),  
      editLabel        = $('#edit_inform_label'),
      contactSegments  = $('#contact_list > div'), 
      groupHeader      = $('#add_new_group_header'),     
      groupsDropDown   = $('#editform .ui.dropdown'),
      btnNewGroup      = $('#new_group_from_contact'),
      deleteIcon       = $('#contact_list .delete.icon'),
      editIcon         = $('#contact_list .pencil.icon'),
      contactInfoDOM   = $('#editform input[type = "text"]'),  

      menuItem         = $('.menu a.item, .menu .link.item'),
      tabHeader        = $('.ui.menu .item'),
      themesDropDown   = $('.ui.dropdown');
      
       
  
  _getAllContacts = function () {

    store = store ? store : new AB.IDBConnector.createStore({primaryKey: uniqKey});
    store.getAll(_renderListOfContacts);
  };

  _renderListOfContacts = function (data) {
    var templateDOM = '';   
    
    dataContacts = data;

    for (var i = 0, l = dataContacts.length; i < l; i++) {
      templateDOM += '<div class="ui segment" id = "' + dataContacts[i][uniqKey] + '"> \
                        <i class="user icon"></i> \
                        <label>' + dataContacts[i].FirstName + ' </label> \
                        <label>' + dataContacts[i].LastName +'</label> \
                        <label id = "groups_label">' + dataContacts[i].Group +'</label> \
                        <i class="delete icon link" data-content="delete contact" data-variation="inverted small" data-position="bottom right"> </i> \
                        <i class="pencil icon link" data-content="edit contact" data-variation="inverted small" data-position="bottom right"> </i> \
                      </div>';
    }

    contactList.html(templateDOM); 

    $('#contact .delete, #contact .pencil').popup('hide');
  };

  _renderListOfGroups = function (data) {
    var templateDOM = '';

    for (var i = 0, l = data.length; i < l; i++) {
      templateDOM += '<div class="title"> \
                        <i class="dropdown icon"></i> \
                        <label>' + data[i].GroupName + '</label> \
                        <input class = "groupInput" type="text"> \
                        <i class="editIcon pencil icon link"></i> \
                        <i class="delete icon link"> </i> \
                      </div> \
                      <div class="content"> \
                        <div class="ui list">';

        for (var j = 0, length = data[i].ListOfContacts.length; j < length; j++){
            templateDOM += '<a class="item"> \
                              <i class="user icon"></i> \
                              ' + data[i].ListOfContacts[j].Name + ' \
                            </a>';
        }

      templateDOM += '</div></div>';
    }

   
    groupList.html(templateDOM);
    groupsAccordion.accordion();
  };

  _addListeners = function () {
    var groups = $('#groupName'),
        stateEdit = false,
        editID,
        tabFlag = 'Contacts',
        _changeEdit;

    body.on('click', function(){
      $('#group_list .groupInput').css('display', 'none');
      $('#group_list label').css('display', 'inline-block');
      $('#group_list .editIcon').removeClass('ok sign').addClass('pencil');
    });

    btnSave.on('click', function (e) {

      !stateEdit ? store.addContact(_getInfoDOM(), _getAllContacts) : store.updateContact(editID, _getInfoDOM(), _getAllContacts);
      _changeEdit();
      
    });

    search_query.keyup(function(e){
        if(e.keyCode == 13){
            btnSearch.click();
        }
    });

    btnNewGroup.on('click', function() {
      $('[data-tab = "groups"]').click();
      groupHeader.addClass('active').next().addClass('active');
      newGroupInput.focus();
    });

    btnAddGroup.on('click', function() {
      var title = newGroupInput.attr('value'),
          self = $(this),
          templateDOM = '<div class="active title"> \
                          <i class="dropdown icon"></i> \
                          <label>' + title + '</label> \
                          <input class = "groupInput" type="text"> \
                          <i class="editIcon pencil icon link"></i> \
                          <i class="delete icon link"> </i> \
                        </div> \
                        <div class="active content"> \
                          <div class="ui list"> \
                            <a class="item"> \
                                Group is empty ... \
                            </a> \
                          </div> \
                        </div>';
      self.parent().parent().removeClass('active').prev().removeClass('active');
      groupDownList.append('<div class = "item">' + title + '</div>');
      groupsDropDown.dropdown({ action: 'changeText' });
      newGroupInput.attr('value', '');
      groupList.append(templateDOM);
      groupsAccordion.accordion();
    });

    btnCancelGroup.on('click', function() {
      $(this).parent().parent().removeClass('active').prev().removeClass('active');
      newGroupInput.attr('value', '');
    });

    btnSearch.on('click', function (e) {
      var searchQuery = search_query.attr('value'),
          str = '';


      contactList.find('div').css('display', 'block');
      groupList.find('div').removeClass('active');

      if (searchQuery !== ''){
        if (tabFlag === 'Contacts') {
            for(var i = 0, l = dataContacts.length; i < l; i++){
                
                if(dataContacts[i].FirstName.indexOf(searchQuery) === -1 && dataContacts[i].LastName.indexOf(searchQuery) === -1) {
                  str += '#' + dataContacts[i].ID + ', ';
                }
            }

            $(str).css('display', 'none');
        }
        else {
            for(var i = 0, l = dataGroups.length; i < l; i++){
                
                if(dataGroups[i].GroupName.indexOf(searchQuery) !== -1) {
                  groupList.find('label:contains(' + dataGroups[i].GroupName + ')').parent().addClass('active').next().addClass('active');
                  break;
                }
            }            
        }
      }

    });

    btnCancel.on('click', function (e) {
      _changeEdit();  

    });

    _changeEdit = function () {
      if (editLabel.parent().hasClass('red')) {
          editLabel.parent().removeClass('red').addClass('green');
          editLabel.text('new');
      }

      contactInfoDOM.val('');
      groups.text('add to / change group');
      eitTitle.text('');
      stateEdit = false;
      $('.pencil').removeClass('red')
    }

    contactList
              .delegate( 'div', {
                  'mouseenter' : function () {                               
                    $(this).addClass('inverted black');},

                  'mouseleave' : function () {
                    $(this).removeClass('inverted black');}

              })

              .delegate('.delete', {
                'click' : function(e){
                  store.deleteContact(+ $(this).parent().attr('id'), _getAllContacts);
                  _changeEdit();
                  e.stopPropagation();}
              })

              .delegate('.pencil', {
                'click' : function(e){
                  var self = $(this);

                  stateEdit = true;
                  editID = + self.parent().attr('id');

                  $('.pencil').not(self).removeClass('red');
                  self.addClass('red');


                  _fillEditForm(editID);
                  if (editLabel.parent().hasClass('green')) {
                      editLabel.parent().removeClass('green').addClass('red');
                      editLabel.text('edit');
                  } 
                  e.stopPropagation();}
              });


    menuItem.on('click', function(){
        var self = $(this);

        tabFlag = 'Contacts';
        if(!self.hasClass('dropdown')) {
            self
              .addClass('active')
              .closest('.ui.menu')
              .find('.item')
                .not($(this))
                .removeClass('active');
        }

        if($('#groups').hasClass('active')){
          _renderListOfGroups(_getDataGroups());
          tabFlag = 'Groups';
        }
    });

    groupHeader.on({
        'mouseenter' : function () {
          $(this).css('opacity', '.6');},
        'mouseleave' : function () {
          var self = $(this);
          if (!self.hasClass('active')) {
            self.css('opacity', '.4');} 
          }
    });

    groupList.delegate('.editIcon', 'click', function(e){
                  var self         = $(this),
                      header       = self.parent(),
                      label        = header.find('label'),
                      input        = header.find('.groupInput');
                  
                  e.stopPropagation();
                  

                  if(!self.hasClass('ok sign')){

                    input.attr('value', label.text()).css('display', 'inline-block').select();  
                    label.css('display', 'none');
                    self.removeClass('pencil').addClass('ok sign');
                  }
                  else {

                    //store.updateGroups(label.text(), input.attr('value'), _renderListOfGroups(_getDataGroups()));

                    self.removeClass('ok sign').addClass('pencil');
                    label.css('display', 'inline-block').text(input.attr('value'));
                    input.css('display', 'none');
                  }

                  $('#group_list .editIcon').not(self).removeClass('ok sign').addClass('pencil');
                  $('#group_list label').not(label).css('display', 'inline-block');
                  $('#group_list .groupInput').not(input).css('display', 'none');
              })

            .delegate('.groupInput', 'click', function(e) {
              e.stopPropagation();
            });

  };
  

  _getInfoDOM = function () {
    var data = $.makeArray(contactInfoDOM),
        groups = $('#groupName').text(),
        objData = {}, i = 0, 
        len = data.length;

    for (; i < len; i++ ){

      objData[data[i].placeholder] = data[i].value;

    } 
    objData['Group'] = (groups !== 'add to / change group') ? groups : 'Without group';

    return objData;
  };

  _fillEditForm = function (id) {
    var l = dataContacts.length,
        data = $.makeArray(contactInfoDOM),
        groups = $('#groupName'),
        ittr = 0;

    for (var i = 0; i < l; i++){
      if (dataContacts[i].ID === id) {

        for (var j in dataContacts[i]){
          if (ittr > 4) break;
          data[ittr].value = dataContacts[i][j];
          ++ittr; 
        }
        dataContacts[i].Group === 'Without group' ? groups.text('add to / change group') : groups.text(dataContacts[i].Group);
        eitTitle.text(data[0].value + ' ' + data[1].value);
      } 
    }

  };

  _getDataGroups = function () {
    var length = dataContacts.length,
        arrGroups = [],
        obj = {},
        arr = [];

    for (var itr = 0; itr < length; itr++) {
      obj[dataContacts[itr].Group] = true;
    }

    arr = Object.keys(obj);

    for(var i = 0, l = arr.length; i < l; i++) {
      var newObj = {},
          data = []; 
          
      for (var j = 0; j < length; j++){
        var contactObj = {};
        if (arr[i] === dataContacts[j].Group) {
            contactObj.Name = dataContacts[j].FirstName + ' ' + dataContacts[j].LastName;
            contactObj.ID = dataContacts[j].ID;
            data.push(contactObj);           
        }
      }

      newObj.ListOfContacts = data;
      newObj.GroupName = arr[i];
      arrGroups.push(newObj); 
    }

    dataGroups = arrGroups;

    return arrGroups;
  };


  $(function constructor() {
    
    //init dropdown menu of themes
    themesDropDown.dropdown({ on: 'hover' });
    
    //init dropdown menu of groups
    groupsDropDown.dropdown({ action: 'changeText' });

    //init tab switch
    tabHeader.tab();

    _getAllContacts();
    _addListeners();
  });

});