// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css";

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
//
import "phoenix_html";
import $ from "jquery";

// Import local files
//
// Local files can be imported directly using relative paths, for example:
import socket from "./socket";
import init_game from './memory';


$(function() {
  
  var buttons = document.getElementsByClassName("Create");
  var i;
  for (i = 0 ; i < buttons.length ; i++) {
      buttons[i].addEventListener("click", buttonPressed, false);
  }
  
  let root = document.getElementById('root');
  if (root) {
    let channel = socket.channel(window.game_name, {})
    init_game(root, channel);
  }
  
});

function buttonPressed() {
    //Referred http://jsbin.com/UpASuHo/113/edit?html,js,output for doubts of form serializing
	window.location.href = "/games/" + $('form').serializeArray()[0]["value"];
}
