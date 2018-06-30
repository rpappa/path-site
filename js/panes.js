/**
 * panes.js
 * openable and closable materialish panes
 * quick 'n dirty like the rest of the code in this project
 */
 $('document').ready(function() {
    $('.pane-body').each(function() {
        let pane = $('<div class="pane"></div>');
        $(this).wrap(pane);
        $(`<div class="pane-top pane-top-${$(this).attr("start")}"><span>${$(this).attr("pane")}</span></div>`).insertBefore(this);
        $(this).parent().find('.pane-top').click(function() {
            $(this).toggleClass("pane-top-open");
            $(this).toggleClass("pane-top-closed");
            $(this).parent().find('.pane-body').toggle();
        });
        if($(this).attr("start") == "closed") {
            $(this).hide();
        }
    });
 });