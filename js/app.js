/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function () {

    localStorage.clear();
    console.log('Creating attendance records...');
    function getRandom() {
        return (Math.random() >= 0.5);
    }

    var names = [
        'Slappy the Frog',
        'Lilly the Lizard',
        'Paulrus the Walrus',
        'Gregory the Goat',
        'Adam the Anaconda'
    ];
    var totalDays = 10;
    var attendance = {};

    $.each(names, function (index, name) {
        attendance[name] = [];
        for (var i = 0; i < totalDays; i++) {
            attendance[name].push(getRandom());
        }
    });

    localStorage.attendance = JSON.stringify(attendance);
}());

$(function () {

    var model = {
        attendance: {},
        totalDays: 0,
        init: function () {
            this.attendance = JSON.parse(localStorage.attendance);
            $.each(this.attendance,
                function (nameString, daysArray) {
                    model.totalDays = daysArray.length;
                    return false; // break loop
                });
        }
    };

    var octopus = {
        init: function () {
            model.init();
            view.init();
        },

        getAttendance: function () {
            return model.attendance;
        },

        getTotalDays: function () {
            return model.totalDays;
        },

        updateStudentAttendance: function (studentName, newAttendance) {
            model.attendance[studentName] = newAttendance;
            view.render ();
        },

        getMissedDaysForStudent: function(studentName) {
            var count = model.attendance[studentName].reduce(function (n, val) {
                return n + (val === false);
            }, 0);
            return count;
        }
    };

    var view = {
        init: function () {
            // build headers
            var thName = $('<th></th>');
            thName.attr('class', 'name-col');
            thName.html('Student Name');
            $('thead tr').append(thName);
            for (var i = 0; i < octopus.getTotalDays() ; i++) {
                var th = $('<th></th>');
                th.html(i + 1);
                $('thead tr').append(th);
            }
            var thDaysMissed = $('<th></th>');
            thDaysMissed.attr('class', 'missed-col');
            thDaysMissed.html('Days Missed-col');
            $('thead tr').append(thDaysMissed);

            // build html for each student
            var trStudent = $('<tr></tr>');
            trStudent.attr('class', 'student');
            var tdName = $('<td></td>');
            tdName.attr('class', 'name-col');
            trStudent.append(tdName);
            var tdCheckBox = $('<td></td>');
            tdCheckBox.attr('class', 'attend-col');
            var input = $('<input/>');
            input.attr('type', 'checkbox');
            input.attr('checked', false);
            tdCheckBox.append(input);
            for (var i = 0; i < octopus.getTotalDays() ; i++) {
                trStudent.append(tdCheckBox.clone());
            }
            var tdMissed = $('<td></td>');
            tdMissed.attr('class', 'missed-col');
            trStudent.append(tdMissed);

            // append each student's name with html
            $.each(octopus.getAttendance(), function (nameString, daysArray) {
                var aStudent = trStudent.clone();
                aStudent.children('.name-col').html(nameString);
                aStudent.find('input')
                    .each(function (index, element) {
                        $(element).attr('checked', daysArray[index]);
                    });
                $('tbody').append(aStudent);
            });

            // add listener for checkboxes
            $('tbody').on('click', 'input', function () {
                var parent = $(this).parents('.student');
                var studentName = parent.find('.name-col').html();
                var checkboxes = parent.find('input');
                var newStudentAttendance =
                    checkboxes
                        .map ((index, value) => {
                            return value.checked;
                        })
                        .get ();
                octopus.updateStudentAttendance(studentName, newStudentAttendance);
            });

            this.render ();
        },

        render: function () {
            $ ('tbody .missed-col')
                .each(function (index, value) {
                    var name = $ (value).siblings ('.name-col').html ();
                    $ (value).html (octopus.getMissedDaysForStudent (name));
                });
        }
    };

    octopus.init();
});


///* STUDENT APPLICATION */
//$(function () {
//    var attendance = JSON.parse(localStorage.attendance),
//        $allMissed = $('tbody .missed-col'),
//        $allCheckboxes = $('tbody input');

//    // Count a student's missed days
//    function countMissing() {
//        $allMissed.each(function () {
//            var studentRow = $(this).parent('tr'),
//                dayChecks = $(studentRow).children('td').children('input'),
//                numMissed = 0;

//            dayChecks.each(function () {
//                if (!$(this).prop('checked')) {
//                    numMissed++;
//                }
//            });

//            $(this).text(numMissed);
//        });
//    }

//    // Check boxes, based on attendace records
//    $.each(attendance, function (name, days) {
//        var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
//            dayChecks = $(studentRow).children('.attend-col').children('input');

//        dayChecks.each(function (i) {
//            $(this).prop('checked', days[i]);
//        });
//    });

//    // When a checkbox is clicked, update localStorage
//    $allCheckboxes.on('click', function () {
//        var studentRows = $('tbody .student'),
//            newAttendance = {};

//        studentRows.each(function () {
//            var name = $(this).children('.name-col').text(),
//                $allCheckboxes = $(this).children('td').children('input');

//            newAttendance[name] = [];

//            $allCheckboxes.each(function () {
//                newAttendance[name].push($(this).prop('checked'));
//            });
//        });

//        countMissing();
//        localStorage.attendance = JSON.stringify(newAttendance);
//    });

//    countMissing();
//}());
