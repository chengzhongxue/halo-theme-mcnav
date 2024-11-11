$(document).ready(function () {
    // 导航详情页面点击图片
    $('.nav-thumbnail').on('click', function () {
        const largeImage = $('#nav-large-image');
        largeImage.attr('src', this.src);
    });
    // 导航详情页面点击进入小程序
    $('#copyTitleButton').on('click', function (e) {
        e.preventDefault();
        const title = $(this).data('value');
        navigator.clipboard.writeText(title)
            .then(function () {
                const openWxModal = new bootstrap.Modal($('#openWxModal')[0]);
                openWxModal.show();
            })
            .catch(function (err) {
                console.error('复制失败:', err);
            });
    });
    //  点赞按钮点击
    $('#agree-btn').on('click', function () {
        var cid = $(this).attr('data-cid');
        var key = $(this).attr('data-key');
        $(this).prop('disabled', true);
        let agreeArr = localStorage.getItem(`mcnav.upvoted.${key}.names`)
            ? JSON.parse(localStorage.getItem(`mcnav.upvoted.${key}.names`))
            : [];
        $.ajax({
            type: 'post',
            contentType: "application/json; charset=utf-8",
            url: '/apis/api.halo.run/v1alpha1/trackers/upvote',
            data: JSON.stringify({
                group: "content.halo.run",
                plural: "posts",
                name: cid,
            }),
            success: function (data) {
                $('#agree-btn').prop('disabled', true);
                var num = $('#agree-btn .num').text();
                $('#agree-btn .num').text(++num);
                $('#agree-btn').addClass('disabled');
                agreeArr.push(cid);
                const val = JSON.stringify(agreeArr);
                localStorage.setItem(`mcnav.upvoted.${key}.names`, val);
            },
            error: function () {
                $('#agree-btn').prop('disabled', false);
            },
        });
    });
});


function initAgree() {
    var agreeAnnius = $('#agree-btn')
    if (agreeAnnius.length > 0) {
        let agreeArr = JSON.parse(localStorage.getItem(`mcnav.upvoted.${$(agreeAnnius[0]).data("key")}.names`))
        for (var i = 0; i < agreeAnnius.length; i++) {
            let cid = $(agreeAnnius[i]).attr('data-cid');
            if (agreeArr != null) {
                let flag = agreeArr.includes(cid);
                if (flag) {
                    $(agreeAnnius[i]).addClass('disabled');
                }
            }


        }
    }
}

initAgree()