$(function (){
    $('form').on('submit', function(event) {
        var canSend = true;
        event.preventDefault();
        $(this).find('input').each(function () {
            if (this.value.length < 3) {
                $(this).addClass('red-frame');
                canSend = false;
            } else {
                $(this).removeClass('red-frame');
            }
        });
        if (canSend) {
            $.ajax({
                url: '/user-page',
                method: 'post',
                data: JSON.stringify(data),
                headers: {
                    'content-type': 'application/json'
                }
            })
        }
    });

    var flag = true;
    $('.mobile-menu').on('click', function () {
        if(flag) {
            flag = false;

            $('.main-header .nav').slideToggle(function () {
                flag = true;
            });
        }
    })
});
