


$(function(){

  $('#randomize').click(function(){


    // Mostly logic to separate out the bad animals... i mean meat.
    var raw_meat = $('#animal_list').val().split(/\n/);
    var tested_meat = [];
    for (var i=0; i < raw_meat.length; i++) {
      if (/\S/.test(raw_meat[i])) {
        tested_meat.push($.trim(raw_meat[i]));
      }
    }

    var trimmed_meat = [];
    for (var i=0; i < tested_meat.length; i++) {
      var meat_parts = tested_meat[i].split(',');
      if(meat_parts.length >= 3){
        trimmed_meat.push({
            name: $.trim(meat_parts[0]),
            prefix: $.trim(meat_parts[1]),
            suffix: $.trim(meat_parts[2])
          });
      }
    }
    console.log(trimmed_meat);

    // If there is only one (or no!) animal.... just give up.
    if(trimmed_meat.length <= 1) return;

    // Choosing the meat... i mean animals.
    var left_animal_choice = Math.floor(Math.random() * (trimmed_meat.length));
    var right_animal_choice = left_animal_choice;
    while(right_animal_choice == left_animal_choice){
      right_animal_choice = Math.floor(Math.random() * (trimmed_meat.length));
    }

    $('#left_animal').html(trimmed_meat[left_animal_choice].name);
    $('#right_animal').html(trimmed_meat[right_animal_choice].name);
    $('#randimal').html(trimmed_meat[left_animal_choice].prefix + '' + trimmed_meat[right_animal_choice].suffix);

  });

});