/*
 * Copyright (C) 2016 www.phantombot.net
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* 
 * @author IllusionaryOne
 */

/*
 * moderationPanel.js
 * Drives the Moderation Panel
 */
(function() {

    var modSettingIcon = [];
        modSettingIcon['false'] = "<i class=\"fa fa-circle-o\" />";
        modSettingIcon['true'] = "<i class=\"fa fa-circle\" />";

    var modSettingMap = [];
        modSettingMap['symbolsToggle'] = "Symbols Protection";
        modSettingMap['capsToggle'] = "Caps Protection";
        modSettingMap['spamToggle'] = "Spam Protection";
        modSettingMap['emotesToggle'] = "Emotes Protection";
        modSettingMap['colorsToggle'] = "Color (/me) Protection";
        modSettingMap['linksToggle'] = "Links Protection";
        modSettingMap['longMessageToggle'] = "Long Message Protection";

        modSettingMap['subscribersModerateLinks'] = "Subscriber " + modSettingMap['linksToggle'];
        modSettingMap['subscribersModerateCaps'] = "Subscriber " + modSettingMap['capsToggle'];
        modSettingMap['subscribersModerateSymbols'] = "Subscriber " + modSettingMap['symbolsToggle'];
        modSettingMap['subscribersModerateSpam'] = "Subscriber " +  modSettingMap['spamToggle'];
        modSettingMap['subscribersModerateEmotes'] = "Subscriber " + modSettingMap['emotesToggle'];
        modSettingMap['subscribersModerateColors'] = "Subscriber " + modSettingMap['colorsToggle'];
        modSettingMap['subscribersModerateLongMsg'] = "Subscriber " + modSettingMap['longMessageToggle'];

        modSettingMap['regularsModerateLinks'] = "Regulars " + modSettingMap['linksToggle'];
        modSettingMap['regularsModerateCaps'] = "Regulars " + modSettingMap['capsToggle'];
        modSettingMap['regularsModerateSymbols'] = "Regulars " + modSettingMap['symbolsToggle'];
        modSettingMap['regularsModerateSpam'] = "Regulars " + modSettingMap['spamToggle'];
        modSettingMap['regularsModerateEmotes'] = "Regulars " + modSettingMap['emotesToggle'];
        modSettingMap['regularsModerateColors'] = "Regulars " + modSettingMap['colorsToggle'];
        modSettingMap['regularsModerateLongMsg'] = "Regulars " + modSettingMap['longMessageToggle'];

        modSettingMap['silentTimeoutLinks'] = "Silent Timeout on " + modSettingMap['linksToggle'];
        modSettingMap['silentTimeoutCaps'] = "Silent Timeout on " + modSettingMap['capsToggle'];
        modSettingMap['silentTimeoutSymbols'] = "Silent Timeout on " + modSettingMap['symbolsToggle'];
        modSettingMap['silentTimeoutSpam'] = "Silent Timeout on " + modSettingMap['spamToggle'];
        modSettingMap['silentTimeoutEmotes'] = "Silent Timeout on " + modSettingMap['emotesToggle'];
        modSettingMap['silentTimeoutColors'] = "Silent Timeout on " + modSettingMap['colorsToggle'];
        modSettingMap['silentTimeoutLongMsg'] = "Silent Timeout on " + modSettingMap['longMessageToggle'];

    /**
     * Not used at this time.
     *
    var modDBMap = [];

        modDBMap['symbolsToggle']     = { 'subscriber' : 'subscribersModerateSymbols', 'regular' : 'regularsModerateSymbols' };
        modDBMap['capsToggle']        = { 'subscriber' : 'subscribersModerateCaps',    'regular' : 'regularsModerateCaps'    };
        modDBMap['spamToggle']        = { 'subscriber' : 'subscribersModerateSpam',    'regular' : 'regularsModerateSpam'    };
        modDBMap['emotesToggle']      = { 'subscriber' : 'subscribersModerateEmotes',  'regular' : 'regularsModerateEmotes'  };
        modDBMap['colorsToggle']      = { 'subscriber' : 'subscribersModerateColors',  'regular' : 'regularsModerateColors'  };
        modDBMap['linksToggle']       = { 'subscriber' : 'subscribersModerateLinks',   'regular' : 'regularsModerateLinks'   };
        modDBMap['longMessageToggle'] = { 'subscriber' : 'subscribersModerateLongMsg', 'regular' : 'regularsModerateLongMsg' };
     *
     **/

    /*
     * onMessage
     * This event is generated by the connection (WebSocket) object.
     */
    function onMessage(message) {
        var msgObject;

        try {
            msgObject = JSON.parse(message.data);
        } catch (ex) {
            return;
        }

        // Check for dbkeysresult queries
        if (panelHasQuery(msgObject)) {
            var modSetting = "",
                modValue = "",
                html = "";

            if (panelCheckQuery(msgObject, 'moderation_blacklist')) {
                if (msgObject['results'].length > 0) {
                    html = "<table>";
                    for (idx in msgObject['results']) {
                        modSetting = msgObject['results'][idx]['key'];
                        modValue = msgObject['results'][idx]['value'];
    
                        html += "<tr class=\"textList\">" +
                                "    <td style=\"width: 15px\" padding=\"5px\">" +
                                "        <div id=\"delete_blackList_" + modSetting + "\" class=\"button\" " +
                                "             onclick=\"$.deleteBlacklist('" + modSetting + "')\"><i class=\"fa fa-trash\" />" +
                                "        </div>" +
                                "    </td>" +
                                "    <td>" + modValue + "</td>" +
                                "</tr>";
                    }
                    html += "</table>";
                } else {
                    html = "<i>No entries in table.</i>";
                }
                $("#blacklistModSettings").html(html);
            }

            if (panelCheckQuery(msgObject, 'moderation_whitelist')) {
                if (msgObject['results'].length > 0) {
                    html = "<table>";
                    for (idx in msgObject['results']) {
                        modSetting = msgObject['results'][idx]['key'];
                        modValue = msgObject['results'][idx]['value'];
    
                        html += "<tr class=\"textList\">" +
                                "    <td style=\"width: 15px\" padding=\"5px\">" +
                                "        <div id=\"delete_whiteList_" + modSetting.replace(".", "_") + "\" class=\"button\" " +
                                "             onclick=\"$.deleteWhitelist('" + modSetting + "')\"><i class=\"fa fa-trash\" />" +
                                "        </div>" +
                                "    </td>" +
                                "    <td>" + modValue + "</td>" +
                                "</tr>";
                    }
                    html += "</table>";
                } else {
                    html = "<i>No entries in table.</i>";
                }
                $("#whitelistModSettings").html(html);
            }

            if (panelCheckQuery(msgObject, 'moderation_chatmod')) {

                /**
                 * Update the text and number based fields.
                 */
                for (idx in msgObject['results']) {
                    modSetting = msgObject['results'][idx]['key'];
                    modValue = msgObject['results'][idx]['value'];

                    switch (modSetting) {
                        case 'linksMessage' :
                        case 'linkPermitTime' :
                        case 'symbolsMessage' :
                        case 'symbolsLimitPercent' :
                        case 'symbolsGroupLimit' :
                        case 'symbolsTriggerLength' :
                        case 'capsMessage' :
                        case 'capsLimitPercent' :
                        case 'capsTriggerLength' :
                        case 'spamMessage' :
                        case 'spamLimit' :
                        case 'emotesMessage' :
                        case 'emotesLimit' :
                        case 'longMessageMessage' :
                        case 'longMessageLimit' :
                        case 'colorsMessage' :
                        case 'warningTime' :
                        case 'timeoutTime' : 
                            $("#" + modSetting + "Input").attr("placeholder", modValue).blur();
                            break;
                    } 
                }

                /**
                 * Build the Toggle Table for all of the moderation options.
                 */
                html = "<table>";
                for (idx in msgObject['results']) {
                    modSetting = msgObject['results'][idx]['key'];
                    modValue = msgObject['results'][idx]['value'];

                    if ((modSetting.indexOf('subscribers') !== 0 || modSetting.indexOf('regulars')) !== 0 && modSetting.indexOf('Toggle') !== -1) {
                        html += "<tr class=\"textList\">" +
                                "<td>" + modSettingMap[modSetting] + "</td>" +

                                "<td style=\"width: 25px\">" +
                                "    <div id=\"modSetting_" + modSetting + "\">" +
                                "        <strong><font style=\"color: magenta\">" + modSettingIcon[modValue] + "</font></strong>" +
                                "    </div>" +
                                "</td>" +

                                "<td style=\"width: 25px\">" +
                                "    <div data-toggle=\"tooltip\" title=\"Enable\" class=\"button\"" +
                                "         onclick=\"$.updateModSetting('" + modSetting + "', 'true');\">" + modSettingIcon['true'] + 
                                "    </div>" +
                                "</td>" +

                                "<td style=\"width: 25px\">" +
                                "    <div data-toggle=\"tooltip\" title=\"Disable\" class=\"button\"" +
                                "         onclick=\"$.updateModSetting('" + modSetting + "', 'false');\">" + modSettingIcon['false'] + 
                                "    </div>" +
                                "</td>" +

                                "</tr>";
                    }
                }
                $("#viewerModSettings").html(html);

                html = "<table>";
                for (idx in msgObject['results']) {
                    modSetting = msgObject['results'][idx]['key'];
                    modValue = msgObject['results'][idx]['value'];

                    if (modSetting.indexOf('regularsModerate') === 0) {
                        html += "<tr class=\"textList\">" +
                                "<td>" + modSettingMap[modSetting] + "</td>" +

                                "<td style=\"width: 25px\">" +
                                "    <div id=\"modSetting_" + modSetting + "\">" +
                                "        <strong><font style=\"color: magenta\">" + modSettingIcon[modValue] + "</font></strong>" +
                                "    </div>" +
                                "</td>" +

                                "<td style=\"width: 25px\">" +
                                "    <div data-toggle=\"tooltip\" title=\"Enable\" class=\"button\"" +
                                "         onclick=\"$.updateModSetting('" + modSetting + "', 'true');\">" + modSettingIcon['true'] +
                                "    </div>" +
                                "</td>" +

                                "<td style=\"width: 25px\">" +
                                "    <div data-toggle=\"tooltip\" title=\"Disable\" class=\"button\" " +
                                "         onclick=\"$.updateModSetting('" + modSetting + "', 'false');\">" + modSettingIcon['false'] +
                                "    </div>" +
                                "</td>" +

                                "</tr>";
                    }
                }
                $("#regularsModSettings").html(html);

                html = "<table>";
                for (idx in msgObject['results']) {
                    modSetting = msgObject['results'][idx]['key'];
                    modValue = msgObject['results'][idx]['value'];

                    if (modSetting.indexOf('subscribersModerate') === 0) {
                        html += "<tr class=\"textList\">" +
                                "<td>" + modSettingMap[modSetting] + "</td>" +
    
                                "<td style=\"width: 25px\">" +
                                "    <div id=\"modSetting_" + modSetting + "\">" +
                                "        <strong><font style=\"color: magenta\">" + modSettingIcon[modValue] + "</font></strong>" +
                                "    </div>" +
                                "</td>" +

                                "<td style=\"width: 25px\">" +
                                "    <div data-toggle=\"tooltip\" title=\"Enable\" class=\"button\"" +
                                "         onclick=\"$.updateModSetting('" + modSetting + "', 'true');\">" + modSettingIcon['true'] +
                                "    </div>" +
                                "</td>" +
    
                                "<td style=\"width: 25px\">" +
                                "    <div data-toggle=\"tooltip\" title=\"Disable\" class=\"button\"" +
                                "         onclick=\"$.updateModSetting('" + modSetting + "', 'false');\">" + modSettingIcon['false'] +
                                "    </div>" +
                                "</td>" +
    
                                "</tr>";
                    }
                }
                $("#subscribersModSettings").html(html);

                html = "<table>";
                for (idx in msgObject['results']) {
                    modSetting = msgObject['results'][idx]['key'];
                    modValue = msgObject['results'][idx]['value'];

                    if (modSetting.indexOf('silentTimeout') === 0) {
                        html += "<tr class=\"textList\">" +
                                "<td>" + modSettingMap[modSetting] + "</td>" +

                                "<td style=\"width: 25px\">" +
                                "    <div id=\"modSetting_" + modSetting + "\">" +
                                "        <strong><font style=\"color: magenta\">" + modSettingIcon[modValue] + "</font></strong>" +
                                "    </div>" +
                                "</td>" +

                                "<td style=\"width: 25px\">" +
                                "    <div data-toggle=\"tooltip\" title=\"Enable\" class=\"button\"" +
                                "         onclick=\"$.updateModSetting('" + modSetting + "', 'true');\">" + modSettingIcon['true'] +
                                "    </div>" +
                                "</td>" +

                                "<td style=\"width: 25px\">" +
                                "    <div data-toggle=\"tooltip\" title=\"Disable\" class=\"button\"" +
                                "         onclick=\"$.updateModSetting('" + modSetting + "', 'false');\">" + modSettingIcon['false'] +
                                "    </div>" +
                                "</td>" +

                                "</tr>";
                    }
                }

                html += "</table>";
                $("#silentModSettings").html(html);
                $('[data-toggle="tooltip"]').tooltip();
            }
        }
    }

    /**
     * @function doQuery
     */
    function doQuery() {
        sendDBKeys("moderation_chatmod", "chatModerator");
        sendDBKeys("moderation_blacklist", "blackList");
        sendDBKeys("moderation_whitelist", "whiteList");
    }

    /**
     * @function addModBlacklist
     */
    function addModBlacklist() {
        var value = $("#addModBlacklistInput").val();
        if (value.length > 0) {
            sendDBUpdate("moderation_addBlacklist", "blackList", "phrase_" + value, value);
            $("#addModBlacklistInput").val("Submitted");
            setTimeout(function() { $("#addModBlacklistInput").val(""); }, TIMEOUT_WAIT_TIME);
            doQuery();
            setTimeout(function() { sendCommand("reloadmod"); }, TIMEOUT_WAIT_TIME);
        }
    }

    /**
     * @function addModWhitelist
     */
    function addModWhitelist() {
        var value = $("#addModWhitelistInput").val();
        if (value.length > 0) {
            sendDBUpdate("moderation_addWhitelist", "whiteList", "link_" + value, value);
            $("#addModWhitelistInput").val("Submitted");
            setTimeout(function() { $("#addModWhitelistInput").val(""); }, TIMEOUT_WAIT_TIME);
            doQuery();
            setTimeout(function() { sendCommand("reloadmod"); }, TIMEOUT_WAIT_TIME);
        }
    }

    /**
     * @function deleteBlacklist
     * @param {String} key
     */
    function deleteBlacklist(key) {
        $("#delete_blackList_" + key).html("<i style=\"color: magenta\" class=\"fa fa-spinner fa-spin\" />");
        sendDBDelete("commands_delblacklist_" + key, "blackList", key);
        setTimeout(function() { doQuery(); }, TIMEOUT_WAIT_TIME);
        setTimeout(function() { sendCommand("reloadmod"); }, TIMEOUT_WAIT_TIME);
    }

    /**
     * @function deleteWhitelist
     * @param {String} key
     */
    function deleteWhitelist(key) {
        $("#delete_whiteList_" + key.replace(".", "_")).html("<i style=\"color: magenta\" class=\"fa fa-spinner fa-spin\" />");
        sendDBDelete("commands_delwhitelist_" + key, "whiteList", key);
        setTimeout(function() { doQuery(); }, TIMEOUT_WAIT_TIME);
        setTimeout(function() { sendCommand("reloadmod"); }, TIMEOUT_WAIT_TIME);
    }

    /**
     * @function disableModeration
     * @param {String} group
     */
    function toggleModeration(group, type) {
        var modDbKeys = [];
        if (group.indexOf('viewers') === 0) {
            modDbKeys = [ "linksToggle", "capsToggle", "spamToggle", "symbolsToggle", "emotesToggle", "longMessageToggle", "colorsToggle" ];
        }

        if (group.indexOf('subscribers') === 0) {
            modDbKeys = [ "subscribersModerateLinks", "subscribersModerateCaps", "subscribersModerateSymbols", "subscribersModerateSpam",
                          "subscribersModerateEmotes", "subscribersModerateColors", "subscribersModerateLongMsg" ];
        }

        if (group.indexOf('regulars') === 0) {
            modDbKeys = [ "regularsModerateLinks", "regularsModerateCaps", "regularsModerateSymbols", "regularsModerateSpam",
                          "regularsModerateEmotes", "regularsModerateColors", "regularsModerateLongMsg" ];
        }

        for (key in modDbKeys) {
            sendDBUpdate("moderation_toggleAll_" + group, "chatModerator", modDbKeys[key], type.toString());
        }
        setTimeout(function() { sendCommand("reloadmod"); }, TIMEOUT_WAIT_TIME);
    }

    /**
     * @function quickSetModeration
     * @param {String} type
     * @param {Boolean} disableSubs
     * @param {Boolean} disableRegs
     * @param {Boolean} disableViewers
     */
    function quickSetModeration(type, disableSubs, disableRegs, disableViewers) {

        if (type.indexOf('extreme') === 0) {
            sendDBUpdate("moderation_quickSet", "chatModerator", "capsLimitPercent", "50");
            sendDBUpdate("moderation_quickSet", "chatModerator", "capsLimitTriggerLength", "10");
            sendDBUpdate("moderation_quickSet", "chatModerator", "spamLimit", "5");
            sendDBUpdate("moderation_quickSet", "chatModerator", "symbolsLimitPercent", "50");
            sendDBUpdate("moderation_quickSet", "chatModerator", "symbolsGroupLimit", "10");
            sendDBUpdate("moderation_quickSet", "chatModerator", "symbolsTriggerLength", "10");
            sendDBUpdate("moderation_quickSet", "chatModerator", "emotesLimit", "10");
            sendDBUpdate("moderation_quickSet", "chatModerator", "longMessageLimit", "200");
            sendDBUpdate("moderation_quickSet", "chatModerator", "colorsToggle", "true");
            sendDBUpdate("moderation_quickSet", "chatModerator", "subscribersModerateColors", "true");
            sendDBUpdate("moderation_quickSet", "chatModerator", "regularsModerateColors", "true");
        }

        if (type.indexOf('high') === 0) {
            sendDBUpdate("moderation_quickSet", "chatModerator", "capsLimitPercent", "50");
            sendDBUpdate("moderation_quickSet", "chatModerator", "capsLimitTriggerLength", "20");
            sendDBUpdate("moderation_quickSet", "chatModerator", "spamLimit", "10");
            sendDBUpdate("moderation_quickSet", "chatModerator", "symbolsLimitPercent", "60");
            sendDBUpdate("moderation_quickSet", "chatModerator", "symbolsGroupLimit", "15");
            sendDBUpdate("moderation_quickSet", "chatModerator", "symbolsTriggerLength", "20");
            sendDBUpdate("moderation_quickSet", "chatModerator", "emotesLimit", "15");
            sendDBUpdate("moderation_quickSet", "chatModerator", "longMessageLimit", "600");
            sendDBUpdate("moderation_quickSet", "chatModerator", "colorsToggle", "true");
            sendDBUpdate("moderation_quickSet", "chatModerator", "subscribersModerateColors", "true");
            sendDBUpdate("moderation_quickSet", "chatModerator", "regularsModerateColors", "true");
        }

        if (type.indexOf('medium') === 0) {
            sendDBUpdate("moderation_quickSet", "chatModerator", "capsLimitPercent", "30");
            sendDBUpdate("moderation_quickSet", "chatModerator", "capsLimitTriggerLength", "30");
            sendDBUpdate("moderation_quickSet", "chatModerator", "spamLimit", "15");
            sendDBUpdate("moderation_quickSet", "chatModerator", "symbolsLimitPercent", "75");
            sendDBUpdate("moderation_quickSet", "chatModerator", "symbolsGroupLimit", "30");
            sendDBUpdate("moderation_quickSet", "chatModerator", "symbolsTriggerLength", "40");
            sendDBUpdate("moderation_quickSet", "chatModerator", "emotesLimit", "30");
            sendDBUpdate("moderation_quickSet", "chatModerator", "longMessageLimit", "800");
            sendDBUpdate("moderation_quickSet", "chatModerator", "colorsToggle", "false");
            sendDBUpdate("moderation_quickSet", "chatModerator", "subscribersModerateColors", "false");
            sendDBUpdate("moderation_quickSet", "chatModerator", "regularsModerateColors", "false");
        }

        if (type.indexOf('low') === 0) {
            sendDBUpdate("moderation_quickSet", "chatModerator", "capsLimitPercent", "20");
            sendDBUpdate("moderation_quickSet", "chatModerator", "capsLimitTriggerLength", "50");
            sendDBUpdate("moderation_quickSet", "chatModerator", "spamLimit", "20");
            sendDBUpdate("moderation_quickSet", "chatModerator", "symbolsLimitPercent", "90");
            sendDBUpdate("moderation_quickSet", "chatModerator", "symbolsGroupLimit", "40");
            sendDBUpdate("moderation_quickSet", "chatModerator", "symbolsTriggerLength", "50");
            sendDBUpdate("moderation_quickSet", "chatModerator", "emotesLimit", "40");
            sendDBUpdate("moderation_quickSet", "chatModerator", "longMessageLimit", "1200");
            sendDBUpdate("moderation_quickSet", "chatModerator", "colorsToggle", "false");
            sendDBUpdate("moderation_quickSet", "chatModerator", "subscribersModerateColors", "false");
            sendDBUpdate("moderation_quickSet", "chatModerator", "regularsModerateColors", "false");
        }

        toggleModeration('subscribers', !disableSubs);
        toggleModeration('regulars', !disableRegs);
        toggleModeration('viewers', !disableViewers);

        if (type.indexOf('linksonly') == 0) {
            toggleModeration('subscribers', 'false');
            toggleModeration('regulars', 'false');
            toggleModeration('viewers', 'false');

            if (!disableSubs) { sendDBUpdate("moderation_linksOnly", "chatModerator", "subscribersModerateLinks", "true"); }
            if (!disableRegs) { sendDBUpdate("moderation_linksOnly", "chatModerator", "regularsModerateLinks", "true"); }
            if (!disableViewers) { sendDBUpdate("moderation_linksOnly", "chatModerator", "linksToggle", "true"); }
        }

        $("#quickModerationUpdate").html("<br><span class=\"purplePill\">&nbsp;Please wait, updating settings...&nbsp;</span>");
        setTimeout(function() { doQuery(); }, TIMEOUT_WAIT_TIME);
        setTimeout(function() { $("#quickModerationUpdate").html(""); }, TIMEOUT_WAIT_TIME);
        setTimeout(function() { sendCommand("reloadmod"); }, TIMEOUT_WAIT_TIME);
    }

    /**
     * @function permitUserCommand() 
     */
    function permitUserCommand() {
        sendCommand("permit " + $("#permitUserInput").val());
        $("#permitUserInput").val("Submitted");
        setTimeout(function() { $("#permitUserInput").val(""); }, TIMEOUT_WAIT_TIME);
    }

    /**
     * @function updateModSetting()
     * @param {String} tableKey
     * @param {String} newValue
     */
    function updateModSetting(tableKey, newValue) {
        $("#modSetting_" + tableKey).html("<i style=\"color: magenta\" class=\"fa fa-spinner fa-spin\" />");
        sendDBUpdate("moderation_updateSetting_" + tableKey, "chatModerator", tableKey, newValue);
        setTimeout(function() {
            $("#modSetting_" + tableKey).html("<strong><font style=\"color: magenta\">" + modSettingIcon[newValue] + "</font></strong>");
        }, TIMEOUT_WAIT_TIME);
        setTimeout(function() { sendCommand("reloadmod"); }, TIMEOUT_WAIT_TIME);
    }

    /**
     * @function updateRedrawModSetting()
     * @param {String} tagId
     * @param {String} tableKey
     */
    function updateRedrawModSetting(tagId, tableKey) {
        var newValue = $(tagId).val();
        if (newValue.length > 0) {
            sendDBUpdate("moderation_updateSetting_" + tableKey, "chatModerator", tableKey, newValue);
            $(tagId).val('')
            $(tagId).attr("placeholder", newValue).blur();
            setTimeout(function() { sendCommand("reloadmod"); }, TIMEOUT_WAIT_TIME);
        }
    }

    // Import the HTML file for this panel.
    $("#moderationPanel").load("/panel/moderation.html");

    // Load the DB items for this panel, wait to ensure that we are connected.
    var interval = setInterval(function() {
        if (isConnected && TABS_INITIALIZED) {
            var active = $("#tabs").tabs("option", "active");
            if (active == 2) {
                doQuery();
                clearInterval(interval);
            }
        }
    }, INITIAL_WAIT_TIME);

    // Query the DB every 30 seconds for updates.
    setInterval(function() {
        var active = $("#tabs").tabs("option", "active");
        if (active == 2 && isConnected) {
            newPanelAlert('Refreshing Moderation Data', 'success', 1000);
            doQuery();
        }
    }, 3e4);

    // Export functions - Needed when calling from HTML.
    $.moderationOnMessage = onMessage;
    $.permitUserCommand = permitUserCommand;
    $.updateModSetting = updateModSetting;
    $.updateRedrawModSetting = updateRedrawModSetting;
    $.quickSetModeration = quickSetModeration;
    $.addModBlacklist = addModBlacklist;
    $.addModWhitelist = addModWhitelist;
    $.deleteBlacklist = deleteBlacklist;
    $.deleteWhitelist = deleteWhitelist;
})();
