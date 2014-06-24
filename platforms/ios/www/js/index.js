/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    // Application Constructor
    initialize: function() {
        
        console.log('Initialize');
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        console.log('Device Ready Yall');

        /*
        $(".pushbutton_onoff").live('vmousedown', function(evt) {
                                    console.log("push onoff");
                                    console.log(evt.target.id + "_on");
                                    sb.send(evt.target.id + "_on", "boolean", "true");
                                    });
        
        $(".pushbutton_onoff").live('vmouseup', function(evt) {
                                    console.log("push onoff");
                                    console.log(evt.target.id + "_off");
                                    sb.send(evt.target.id + "_off", "boolean", "true");
                                    });
        */
        
        $(".pushbutton_onoff").on("touchstart", function(evt) {
                                  console.log("push onoff");
                                  console.log(evt.target.id + "_on");
                                  sb.send(evt.target.id + "_on", "boolean", "true");
                                  });
        
        app.receivedEvent('deviceready');
        
        var random_id = "0000" + Math.floor(Math.random() * 10000);
        
        app_name = app_name + ' ' + random_id.substring(random_id.length-4);
        
        
        // create spacebrew client object
        //sb = new Spacebrew.Client({reconnect:true});
        console.log('SB new client');

        
        // set the base description
        //sb.name(app_name);
        //sb.description("This spacebrew client sends and receives boolean messages.");
        console.log('SB description');

        // configure the publication and subscription feeds
        //sb.addPublish( "buttonPress", "boolean", "false" );
        //sb.addSubscribe( "toggleBackground", "boolean" );
        
        // override Spacebrew events - this is how you catch events coming from Spacebrew
        //sb.onBooleanMessage = onBooleanMessage;
        //sb.onOpen = onOpen;
        
        // connect to spacbrew
        //sb.connect();
        console.log('SB connected');
        
        //createSBInstance();
        console.log('SB create instance');
        
        //Create SB Instance
        app.createSBInstance();

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
        /*
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        */
        
        console.log('Received Event: ' + id);
    },

    /*
     *	ON SPACEBREW OPEN
     */
    onSpacebrewOpen: function() {
        
        var message = "Now connected as <strong>" + sb.name() + "</strong>. ";
        if (sb.name() === app_name) {
            message += "<br>You can customize this app's name in the query string by adding <strong>name=your_app_name</strong>."
        }
        $("#name").html( message );
    },

    /**
     * onRangeMessage Function that is called whenever new spacebrew range messages are received.
     * 				  It accepts two parameters:
     * @param  {String} name  	Holds name of the subscription feed channel
     * @param  {Integer} value 	Holds value received from the subscription feed
     */
    onRangeMessage: function(name, value){
        console.log("Received new range message ", value);
        $("#"+name).slider('refresh', value);
    },

    /**
     * onBooleanMessage Function that is called whenever new spacebrew boolean messages are received.
     *          It accepts two parameters:
     * @param  {String} name    Holds name of the subscription feed channel
     * @param  {Boolean} value  Holds value received from the subscription feed
     */
    onBooleanMessage: function( name, value ){
        console.log(name + " " + value);
    },

    onButtonPress: function(evt) {
        console.log("[onButtonPress] button has been pressed");
        console.log(evt.target.id);
        sb.send(evt.target.id, "boolean", "true");
    },
    
    createSBInstance: function() {
        
        console.log("Create an instance");
        
        //Grab the URL variables
        interaction.user = "adamlassy"; //nescape(window.getQueryString("user"));
        interaction.uuid = "324893141"; //unescape(window.getQueryString("uuid"));
        interaction.type = "client"; //unescape(window.getQueryString("type"));
        
        
        url_interaction = "http://lab.madsci1.havasworldwide.com/context/" + interaction.uuid;
        model_interaction = "context.interaction";
        
        //$(".pushbutton").on("mousedown", onButtonPress);
        
        /*
        $(".pushbutton").live('vmousedown', function(evt) {
                              //$(".pushbutton").vmousedown(function(evt) {
                              //onButtonPress;
                              console.log("[onButtonPress] button has been pressed");
                              console.log(evt.target.id);
                              sb.send(evt.target.id, "boolean", "true");
                              });
        */

        //Get Interaction Set
        sb = new Spacebrew.Client();
        sb.extend(Spacebrew.Admin)
        
        //sb.onRangeMessage = onRangeMessage;
        
        sb.onOpen = app.onSpacebrewOpen;
        sb.onBooleanMessage = app.onBooleanMessage;
        

        var request = $.ajax({
                             dataType: "json",
                             url: url_interaction,
                             success: function(data) {
                             
                             
                             connection_data = data;
                             
                             //Get Interaction info
                             _row = data[0]
                             if (_row) {
                             interaction.num_users = _row.fields['num_users'];
                             interaction.client_name = _row.fields['client_name'];
                             interaction.server_name = _row.fields['server_name'];
                             interaction.name = _row.fields['name'];
                             interaction.description = _row.fields['description'];
                             
                             if (interaction.type == "client") {
                             var random_id = "0000" + Math.floor(Math.random() * 10000);
                             var random_id = random_id.substring(random_id.length-4);
                             
                             interaction.connection = _row.fields['client_name'] + "_" + interaction.user + random_id;
                             } else {
                                interaction.connection = _row.fields['server_name'];
                             }
                             
                             console.log("Interaction Server : " + interaction.connection);
                             
                             sb.name(interaction.connection);
                             sb.description(interaction.description);
                             }
                             
                             //For each Spacebrew connection
                             for (i=1; i<data.length; i++) {
                             
                                console.log(data[i].fields);
                                _fields = data[i].fields;
                             
                                console.log("pub " + _fields['clientPublish']);
                             
                                interaction.client_publish = _row.fields[''];
                                if (interaction.type == "client" && _fields['clientPublish']) {
                                    sb.addPublish(_fields['name'], _fields['dataType']);
                                } else {
                                    sb.addSubscribe(_fields['name'], _fields['dataType']);
                                }
                             }
                             
                             console.log("* Setting up spacebrew connection");
                             sb.connect();
                             
                             },
                             timeout: 8000
                             
                             }).fail( function( xhr, status ) {
                                     console.log("fail");
                                     })
        
    }

};
