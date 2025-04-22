function displayDate() {
    var today = new Date();

    var day = today.getDay();
    var date = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();

    var seconds = today.getSeconds().toString().padStart(2, '0');
    var minutes = today.getMinutes().toString().padStart(2, '0');
    var hours = today.getHours().toString().padStart(2, '0');

    var dayofWeek = ['Chủ nhật', 'Thứ hai',  'Thứ ba',  'Thứ tư',  'Thứ năm',  'Thứ sáu',  'Thứ bảy'];
    var dayName = dayofWeek[day];

    var todayString = `${dayName}, ngày ${date}.${month}.${year}, ${hours}:${minutes}:${seconds}`;

    document.getElementById('date-today').innerHTML = todayString;
}
window.onload = function() {
    displayDate();
    setInterval(displayDate, 1000);
};

const callSearch = document.getElementById('call-btn-search');
const containerSearch = document.querySelector('.search-bar-mobile');

callSearch.addEventListener('click', function() {
    containerSearch.classList.toggle('hidden');
});


const menu = document.getElementById('menu-toggle');
const navMenu = document.querySelector('.nav-content-wrapper');

menu.addEventListener('click', function() {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
});

document.addEventListener('DOMContentLoaded', function() {

    //Banner

    // Hàm cập nhật giao diện banner
    function updateBanner(wrapper, currentIndex) {
        const slideWidth = wrapper.querySelector('.banner-slide').offsetWidth;
        wrapper.style.transform = `translateX(-${currentIndex * slideWidth + currentIndex * 9}px)`;
    }
    

    function nextSlide(wrapper, currentIndex, totalSlides) {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateBanner(wrapper, currentIndex);
        return currentIndex; // Cập nhật lại chỉ số slide hiện tại
    }
    
    function prevSlide(wrapper, currentIndex, totalSlides) {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateBanner(wrapper, currentIndex);
        return currentIndex; // Cập nhật lại chỉ số slide hiện tại
    }

    function createBanner(slideImages, containerSelector, isSmallBanner = false) {
        const bannerContainer = document.getElementById(containerSelector);
    
        if (!bannerContainer) {
            console.error(`Container ${containerSelector} không tồn tại.`);
            return;
        }
    
        const length = slideImages.length;
        let currentIndex = 0;
    
        if (isSmallBanner) {
            // Tạo nội dung banner nhỏ
            const bannerContent = slideImages.map(slide =>
                `
                <a href='${slide.link}'  class="banner-slide">
                    <img src='${slide.image}' alt=''>
                    <p class='slide-title small-banner-title'>
                        ${slide.title}
                    </p>
                </a>
                `
            ).join('');
            bannerContainer.innerHTML = bannerContent;
    
            // Gắn sự kiện điều hướng
            const prevButton = document.getElementById('prev-btn');
            const nextButton = document.getElementById('next-btn');
            const wrapper = document.querySelector(`#${containerSelector}`);
    
            if (prevButton && nextButton) {
                prevButton.addEventListener('click', () => {
                    currentIndex = prevSlide(wrapper, currentIndex, length-4);
                });
    
                nextButton.addEventListener('click', () => {
                    currentIndex = nextSlide(wrapper, currentIndex, length-4);
                });
            }

            setInterval (() => {
                currentIndex = nextSlide(wrapper, currentIndex, length-4);
            }, 2500);
        } else {
            function createDots(numSlides, dotContainerId) {
                const dotContainer = document.getElementById(dotContainerId);
                if (!dotContainer) {
                    console.error(`Container ${dotContainerId} không tồn tại.`);
                    return;
                }
            
                // Xóa các dot cũ (nếu có)
                dotContainer.innerHTML = '';
            
                // Tạo dot mới
                for (let i = 0; i < numSlides; i++) {
                    const dot = document.createElement('span');
                    dot.className = 'dot';
                    dotContainer.appendChild(dot);
                }
            }

            const length = slideImages.length;

            
            createDots(length, 'dot-container');
            
            function showSlide(index) {
                const slide = slideImages[index];
                bannerContainer.innerHTML = 
                `
                <img src='${slide.image}' alt=''>
                <a href='${slide.link}' class='slide-title'>
                    ${slide.title}
                </a>
                `;

                const dots = document.querySelectorAll('.dot');
                dots.forEach((dot, i) => {
                    if (i === index) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
            showSlide(currentIndex);
    
            setInterval(() => {
                currentIndex = (currentIndex + 1) % length;
                showSlide(currentIndex);
            }, 3000);
        }
    }

    createBanner(bigBannerSlides, 'banner-big-wrapper');
    createBanner(libraryBannerSlides, 'thu-vien-anh-slide');
    createBanner(smallBannerSlides, 'small-banner', true);

    //End Banner

    //Tabs
    
    function createTabs(tabId, contentId, tabs) {
        const containerTab = document.getElementById(tabId);
        const containerContent = document.getElementById(contentId);
    
        if (!containerTab) {
            console.error(`Container ${tabId} không tồn tại.`);
            return;
        }
    
        // Tạo các tab buttons
        const tabButtons = tabs.map((tab) => 
            `
            <li>
                <img src='/images/logo/logo_bg.png' class='hidden'>
                <a href="#" data-tab-id="${tab.id}">${tab.title}</a>
            </li>
            `
        ).join('');
        containerTab.innerHTML = tabButtons;
    
        if (!containerContent) {
            console.error(`Container ${contentId} không tồn tại.`);
            return;
        }
    
        // Tạo nội dung cho mỗi tab
        const tabContents = tabs.map((tab) => 
            `<div id="${tab.id}" class="tab-content">
                ${createContent(tab.content)}
            </div>`
        ).join('');
        containerContent.innerHTML = tabContents;
    
        // Ẩn tất cả nội dung tab trừ tab đầu tiên
        const allTabContents = containerContent.querySelectorAll('.tab-content');
        allTabContents.forEach((content) => {
            content.style.display = 'none';
        });
    
        // Gắn sự kiện click cho từng tab
        const tabLinks = containerTab.querySelectorAll('a');
        tabLinks.forEach(link => {
            link.addEventListener('click', function (event) {
                event.preventDefault();
    
                // Ẩn tất cả nội dung tab
                allTabContents.forEach(content => content.style.display = 'none');
    
                // Hiển thị nội dung của tab được chọn
                const tabId = this.getAttribute('data-tab-id');
                const currentTabContent = document.getElementById(tabId);
                if (currentTabContent) {
                    currentTabContent.style.display = 'block';
                }
    
                // Thay đổi trạng thái của tab
                tabLinks.forEach(link => {
                    link.classList.remove('active');
                    link.parentElement.classList.remove('active');
                });
                this.classList.add('active');
                this.parentElement.classList.add('active');
            });
        });
    
        // Hiển thị tab đầu tiên mặc định
        if (tabs.length > 0) {  
            const firstTabId = tabs[0].id;
            document.getElementById(firstTabId).style.display = 'block';
            const firstTab = containerTab.querySelector('a');
            firstTab.classList.add('active');
            firstTab.parentElement.classList.add('active');
        }
    }    

    
    function createContent(content) {
        if (Array.isArray(content)) {
            if(typeof content[0] === 'object') {
                const keys = Object.keys(content[0]);
                if(keys.length === 2) {
                    return `
                    <div class='content-tab-wrapper'>
                        <ul>
                            ${content.map(item =>
                                `
                                <li>
                                    <a href='${item.link}' target='_blank'>${item.title}</a>
                                </li>
                                `
                            ).join('')}
                        </ul>
                    </div>
                    `;
                } else if(keys.length === 3) {
                    return `
                    <ul>
                        ${content.map(item => `
                            <li>
                                <img src='${item.img}'>
                                <a href='${item.link}' target='_blank'>${item.title}</a>
                            </li>
                        `).join('')}
                    </ul>
                    `;
                } else if(keys.length > 3) {
                    return `
                        <div class="table-content">
                            <table>
                                ${content.map(item => `
                                    <tr>
                                        <td class="table-content-title">
                                            <img src="${item.img}">
                                            <a href="${item.documentPath}">${item.contentTitle}</a>
                                        </td>
                                        <td>
                                            <a href="${item.documentPath}">
                                                <img src="./images/main-content/tabs/icon-donwload.png" alt="icon">
                                            </a>
                                        </td>
                                    </tr>
                                `).join('')}
                            </table>
                            <div class="xem-them">
                                <a href="#" class="readmore">Xem thêm &gt;</a>
                            </div>
                        </div>
                    `;
                } else {
                    return `<p>${content}</p>`;
                }
            } else if(typeof content[0] === 'string') {
                return `<p>${content}</p>`;
            }
        } else if (typeof content === 'object') {
            return `
                <div class="tab-content-title">
                    <img class="tab-img" src="${content.img}" alt="${content.contentTitle}">
                    <h4>${content.contentTitle}<span> (${content.date})</span></h4>
                    <p>${content.mainContent}</p>
                    <div class="row-cont">
                        <a href="#" class="readmore show-content">Xem tiếp &gt;</a>
                    </div>
                </div>
                <div class="second-block">
                    <ul>
                        ${content.secondBlock.map(item => `
                            <li>
                                ${item.content} <span>(${item.date})</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="row-cont">
                    <a href="#" class="readmore">Xem thêm &gt;</a>
                </div>
            `;
        } else {
            // Xử lý nội dung khác (nếu có)
            return `<p>${content}</p>`;
        }
    }
    
    // Tạo các tab cho từng container
    createTabs('dieu-hanh-tabs', 'dieu-hanh-content', dieuHanhTabs);
    createTabs('van-ban-tabs', 'van-ban-content', vanBanTabs);
    createTabs('quy-hoach-tabs', 'quy-hoach-content', quyHoachTabs);
    createTabs('dau-thau-tabs', 'dau-thau-content', dauThauTabs);
    createTabs('so-ban-nganh-tabs', 'so-ban-nganh-content', soBanNganhTabs);
    createTabs('huyen-thixa-thanhpho-tabs', 'huyen-thixa-thanhpho-content', huyenThixaThanhphoTabs);
    createTabs('sbn-htxtp-hdt-tdhcdthcn-tabs', 'sbn-htxtp-hdt-tdhcdthcn-content', sbnHtxtpHdtTdhcdthcnTabs);
    createTabs('support-tabs', 'support-content', supportTabs);

    //End Tabs
});

//Dữ liệu banner

const bigBannerSlides = [
    {
        image: './images/banner/banner-big/article.png',
        title: 'Bắc Giang ra mắt đơn vị hành chính thị xã Chũ và huyện Lục Ngạn; khai mạc Hội chợ cam, bưởi và Tuần Du lịch Lục Ngạn',
        link: '#'
    },
    {
        image: './images/banner/banner-big/article_2.jpg',
        title: 'Toàn văn phát biểu của Bí thư Tỉnh ủy Nguyễn Văn Gấu tại lễ ra mắt đơn vị hành chính thị xã Chũ và huyện Lục Ngạn và Hội chợ cam, bưởi và Tuần Du...',
        link: '#'
    },
    {
        image: "./images/banner/banner-big/article_3.jpg",
        title: "Ngành Công Thương triển khai nhiệm vụ năm 2025",
        link: "#"
    }
];

const libraryBannerSlides = [
    {
        image: './images/sub-content/thu_vien_anh/120240830154143.png',
        title: 'Một số hình ảnh Đại hội đại biểu MTTQ tỉnh Bắc Giang lần thứ XV, nhiệm kỳ 2024 - 2029',
        link: '#'
    },
    {
        image: './images/sub-content/thu_vien_anh/120240830154319.png',
        title: 'Một số hình ảnh Đại hội đại biểu MTTQ tỉnh Bắc Giang lần thứ XV, nhiệm kỳ 2024 - 2029',
        link: '#'
    },
    {
        image: './images/sub-content/thu_vien_anh/120240830154350.png',
        title: 'Một số hình ảnh Đại hội đại biểu MTTQ tỉnh Bắc Giang lần thứ XV, nhiệm kỳ 2024 - 2029',
        link: '#'
    }
];

const smallBannerSlides = [
    {
        image: './images/banner/banner-small/article.jpg',
        title: 'Thanh tra Chính phủ sơ kết 5 năm thực hiện Luật Phòng, chống tham nhũng',
        link: 'https://bacgiang.gov.vn/chi-tiet-tin-tuc/-/asset_publisher/St1DaeZNsp94/content/thanh-tra-chinh-phu-so-ket-05-nam-thuc-hien-luat-phong-chong-tham-nhung'
    },
    {
        image: './images/banner/banner-small/article_2.png',
        title: 'Chương trình nghệ thuật Chào mừng kỷ niệm 80 năm Ngày thành lập Quân đội Nhân...',
        link: 'https://bacgiang.gov.vn/chi-tiet-tin-tuc/-/asset_publisher/St1DaeZNsp94/content/chuong-trinh-nghe-thuat-chao-mung-ky-niem-80-nam-ngay-thanh-lap-quan-oi-nhan-dan-viet-nam'
    },
    {
        image: './images/banner/banner-small/article_3.png',
        title: 'Giải chạy “Bắc Giang mùa quả ngọt” năm 2024',
        link: 'https://bacgiang.gov.vn/chi-tiet-tin-tuc/-/asset_publisher/St1DaeZNsp94/content/giai-chay-bac-giang-mua-qua-ngot-nam-2024'
    },
    {
        image: './images/banner/banner-small/article_4.jpg',
        title: 'Lục Ngạn: Nhiều hoạt động đặc sắc tại Hội chợ cam, bưởi và Tuần Du lịch năm 2024',
        link: 'https://bacgiang.gov.vn/chi-tiet-tin-tuc/-/asset_publisher/St1DaeZNsp94/content/luc-ngan-nhieu-hoat-ong-ac-sac-tai-hoi-cho-cam-buoi-va-tuan-du-lich-nam-2024'
    },
    {
        image: './images/banner/banner-small/article_5.jpg',
        title: 'Toàn văn phát biểu của Bí thư Tỉnh ủy Nguyễn Văn Gấu tại lễ ra mắt đơn vị...',
        link: 'https://bacgiang.gov.vn/chi-tiet-tin-tuc/-/asset_publisher/St1DaeZNsp94/content/toan-van-phat-bieu-cua-bi-thu-tinh-uy-nguyen-van-gau-tai-le-ra-mat-on-vi-hanh-chinh-thi-xa-chu-va-huyen-luc-ngan-va-hoi-cho-cam-buoi-va-tuan-du-lich-l'
    },
    {
        image: './images/banner/banner-small/article_6.jpg',
        title: 'Bắc Giang ra mắt đơn vị hành chính thị xã Chũ và huyện Lục Ngạn; khai mạc Hội...',
        link: 'https://bacgiang.gov.vn/chi-tiet-tin-tuc/-/asset_publisher/St1DaeZNsp94/content/le-ra-mat-on-vi-hanh-chinh-thi-xa-chu-va-huyen-luc-ngan'
    },
    {
        image: './images/banner/banner-small/article_7.jpg',
        title: 'Hơn 30 gian hàng được trưng bày tại Hội chợ cam, bưởi và Tuần Du lịch Lục...',
        link: 'https://bacgiang.gov.vn/chi-tiet-tin-tuc/-/asset_publisher/St1DaeZNsp94/content/hon-30-gian-hang-uoc-trung-bay-tai-hoi-cho-cam-buoi-va-tuan-du-lich-luc-ngan-nam-2024'
    },
    {
        image: './images/banner/banner-small/article_8.jpg',
        title: 'Một số hình ảnh trước lễ ra mắt đơn vị hành chính thị xã Chũ và huyện Lục...',
        link: 'https://bacgiang.gov.vn/chi-tiet-tin-tuc/-/asset_publisher/St1DaeZNsp94/content/chum-anh-khong-khi-chuan-bi-truoc-le-ra-mat-on-vi-hanh-chinh-thi-xa-chu-va-huyen-luc-ngan-va-hoi-cho-cam-buoi-va-tuan-du-lich-luc-ngan-nam-2024'
    },
    {
        image: './images/banner/banner-small/article_9.jpg',
        title: 'Ngành Nội vụ tổng kết công tác năm 2024, triển khai nhiệm vụ năm 2025',
        link: '#'
    },
    {
        image: './images/banner/banner-small/article_10.jpg',
        title: 'Tổng kết công tác ngoại giao kinh tế năm 2024 và trọng tâm năm 2025',
        link: '#'
    },
    {
        image: './images/banner/banner-small/article_11.jpg',
        title: 'Tập trung cao triển khai hiệu quả các nhiệm vụ ngay từ tháng đầu năm của năm...',
        link: '#'
    },
    {
        image: './images/banner/banner-small/article_12.jpg',
        title: 'Bắc Giang tổ chức hội nghị kết nối, hỗ trợ hợp tác xã quảng bá sản phẩm',
        link: '#'
    },
    {
        image: './images/banner/banner-small/article_13.jpg',
        title: 'Phó Chủ tịch UBND tỉnh Phan Thế Tuấn thăm, chúc Tết một số cơ quan hợp tác...',
        link: '#'
    },
    {
        image: './images/banner/banner-small/article_14.jpg',
        title: 'Đoàn công tác tỉnh Bắc Giang thăm, chúc mừng Quân khu 1 và Bộ CHQS tỉnh',
        link: '#'
    },
    {
        image: './images/banner/banner-small/article_15.png',
        title: 'Đoàn đại biểu tỉnh Bắc Giang dâng hương tưởng niệm Đền thờ các anh hùng liệt...',
        link: '#'
    }
];


// Dữ liệu tab
const dieuHanhTabs = [
    { 
        id: 'tab1',
        title: 'CHỈ ĐẠO ĐIỀU HÀNH CỦA TỈNH',
        content: {
            img: './images/main-content/tabs/article.jpg',
            contentTitle: 'Chỉ thị về việc tổ chức đón Tết Nguyên đán Ất Tỵ năm 2025',
            date: '26/12/2024',
            mainContent: 'Chủ tịch UBND tỉnh Bắc Giang vừa ban hành Chỉ thị số 11/CT-UBND về việc tổ chức đón Tết Nguyên...',
            secondBlock: [
                {
                    content: 'Tăng cường giải pháp quản lý, vận hành bảo đảm an toàn hồ chứa nước',
                    date: '25/12/2024'
                },
                {
                    content: 'Công bố danh mục thủ tục hành chính mới ban hành lĩnh vực chính sách, danh mục thủ tục hành chính...',
                    date: '25/12/2024'
                },
                {
                    content: 'Bắc Giang đổi tên 08 đơn vị sự nghiệp trực thuộc Sở Giáo dục và Đào tạo',
                    date: '24/12/2024'
                },
                {
                    content: 'Chủ động phòng, chống hạn hán, thiếu nước',
                    date: '24/12/2024'
                }
            ]                
        }
    },
    { 
        id: 'tab2',
        title: 'CHỈ ĐẠO ĐIỀU HÀNH CỦA TW',
        content: {
            img: './images/main-content/tabs/csdt-lai-xe-17351219919091316071401.jpg',
            contentTitle: 'Điều kiện kinh doanh cơ sở đào tạo lái xe ô tô, áp dụng từ 1/1/2025',
            date: '26/12/2024',
            mainContent: 'Chính phủ ban hành Nghị định 160/2024/NĐ-CP về hoạt động đào tạo và sát hạch lái xe, trong đó quy...',
            secondBlock: [
                {
                    content: 'Giảm lãi suất cho vay tại Ngân hàng Chính sách hỗ trợ khách hàng bị ảnh hưởng của bão số 3',
                    date: '25/12/2024'
                },
                {
                    content: 'Công bố thủ tục hành chính được sửa đổi, bổ sung lĩnh vực Lâm nghiệp',
                    date: '24/12/2024'
                },
                {
                    content: 'Bộ Nội vụ điều chỉnh, bổ sung danh mục thủ tục hành chính lĩnh vực quản lý nhà nước về Hội và Quỹ',
                    date: '24/12/2024'
                },
                {
                    content: 'Tăng cường phòng ngừa, xử lý hoạt động lừa đảo chiếm đoạt tài sản sử dụng công nghệ cao, trên...',
                    date: '24/12/2024'
                },
                {
                    content: 'Thủ tướng chỉ đạo thực hiện các giải pháp thúc đẩy tăng trưởng kinh tế năm 2025',
                    date: '24/12/2024'
                }
            ]                
        },
    }
];

const vanBanTabs = [
    { 
        id: 'tab3',
        title: 'VĂN BẢN MỚI',
        content: [
            {
                img: './images/main-content/tabs/icon-vbpq-home.png',
                contentTitle: 'QĐ v/v cho phép chuyển mục đích sử dụng đất để thực hiện dự án: Khu đô thị Đồng Cửa 2, thị trấn... (26/12/2024)',
                documentPath: '#',
                downloadPath: '#'
            },
            {
                img: './images/main-content/tabs/icon-vbpq-home.png',
                contentTitle: 'KH Kiểm tra, rà soát văn bản và công tác pháp chế năm 2025 (26/12/2024)',
                documentPath: '#',
                downloadPath: '#'
            },
            {
                img: './images/main-content/tabs/icon-vbpq-home.png',
                contentTitle: 'KH Thực hiện công tác quản lý xử lý vi phạm hành chính trên địa bàn tỉnh Bắc Giang năm 2025 (26/12/2024)',
                documentPath: '#',
                downloadPath: '#'
            },
            {
                img: './images/main-content/tabs/icon-vbpq-home.png',
                contentTitle: 'QDD v/v Chủ tịch UBND tỉnh tặng Bằng khen và Danh hiệu năm 2024 (khối tham mưu tổng hợp) (25/12/2024)',
                documentPath: '#',
                downloadPath: '#'
            },
            {
                img: './images/main-content/tabs/icon-vbpq-home.png',
                contentTitle: 'QĐ v/v Xử phạt vi phạm hành chính đối với Hộ kinh doanh Lan Quý (25/12/2024)',
                documentPath: '#',
                downloadPath: '#'
            },
            {
                img: './images/main-content/tabs/icon-vbpq-home.png',
                contentTitle: 'QĐ v/v cho phép chuyển mục đích sử dụng đất để thực hiện Dự án đầu tư xây dựng và kinh doanh hạ... (25/12/2024)',
                documentPath: '#',
                downloadPath: '#'
            }
        ]
    },
    { 
        id: 'tab4',
        title: 'GIẤY MỜI', 
        content: [
            {
                img: './images/main-content/tabs/icon-vbpq-home.png',
                contentTitle: 'Dự hội nghị trực tuyến toàn quốc tổng kết công tác dân tộc năm 2024 và triển khai nhiệm vụ năm 2025 (25/12/2024)',
                documentPath: '#',
                downloadPath: '#'
            },
            {
                img: './images/main-content/tabs/icon-vbpq-home.png',
                contentTitle: 'V/v mời dự Hội nghị quán triệt, triển khai thi hành các luật, nghị quyết được thông qua tại Kỳ... (24/12/2024)',
                documentPath: '#',
                downloadPath: '#'
            },
            {
                img: './images/main-content/tabs/icon-vbpq-home.png',
                contentTitle: 'Mời dự Hội nghị trực tuyến tổng kết công tác năm 2024 và triển khai kế hoạch năm 2025 ngành Nông... (23/12/2024)',
                documentPath: '#',
                downloadPath: '#'
            },
            {
                img: './images/main-content/tabs/icon-vbpq-home.png',
                contentTitle: 'Giấy mời dự Hội nghị trực tuyến toàn quốc triển khai nhiệm vụ công tác năm 2025 của ngành Nội vụ (19/12/2024)',
                documentPath: '#',
                downloadPath: '#'
            },
            {
                img: './images/main-content/tabs/icon-vbpq-home.png',
                contentTitle: '(Hỏa tốc) V/v thay đổi thời gian tổ chức Hội nghị UBND tỉnh thường kỳ tháng 12 năm 2024 (19/12/2024)',
                documentPath: '#',
                downloadPath: '#'
            },
            {
                img: './images/main-content/tabs/icon-vbpq-home.png',
                contentTitle: '(HỎA TỐC) GM dự Hội nghị trực tuyến toàn quốc sơ kết 5 năm thực hiện Luật Phòng, chống tham nhũng (19/12/2024)',
                documentPath: '#',
                downloadPath: '#'
            }
        ]
    },
    { 
        id: 'tab5', 
        title: 'THÔNG BÁO - KẾT LUẬN', 
        content: [
            {
                img: './images/main-content/tabs/icon-vbpq-home.png',
                contentTitle: 'QĐ v/v Xử phạt vi phạm hành chính đối với Hộ kinh doanh Lan Quý (25/12/2024)',
                documentPath: '#',
                downloadPath: '#'
            },
            {
                img: './images/main-content/tabs/icon-vbpq-home.png',
                contentTitle: 'QĐ v/v cho phép chuyển mục đích sử dụng đất để thực hiện Dự án đầu tư xây dựng và kinh doanh hạ... (25/12/2024)',
                documentPath: '#',
                downloadPath: '#'
            },
            {
                img: './images/main-content/tabs/icon-vbpq-home.png',
                contentTitle: 'QĐ v/v cho Công ty cổ phần đầu tư và phát triển Hà Thịnh thuê đất để thực hiện Dự án đầu tư xây... (25/12/2024)',
                documentPath: '#',
                downloadPath: '#'
            },
            {
                img: './images/main-content/tabs/icon-vbpq-home.png',
                contentTitle: 'QĐ v/v Ủy quyền cho Sở Thông tin và Truyền thông tổ chức triển khai, quản lý, sử dụng dịch vụ... (25/12/2024)',
                documentPath: '#',
                downloadPath: '#'
            },
            {
                img: './images/main-content/tabs/icon-vbpq-home.png',
                contentTitle: 'KH Thực hiện công tác bồi thường nhà nước tỉnh Bắc Giang năm 2025 (25/12/2024)',
                documentPath: '#',
                downloadPath: '#'
            },
            {
                img: './images/main-content/tabs/icon-vbpq-home.png',
                contentTitle: 'KH tổ chức Hội nghị sơ kết công tác chỉ đạo, thực hiện Chuyển đổi số và Đề án 06/CP năm... (25/12/2024)',
                documentPath: '#',
                downloadPath: '#'
            }
        ]
    }
];

const quyHoachTabs = [
    { 
        id: 'tab6',
        title: 'Thông tin quy hoạch',
        content: {
            img: './images/main-content/tabs/quy-hoach.jpg',
            contentTitle: 'Phê duyệt Đồ án Quy hoạch phân khu số 03 thị xã Việt Yên, tỉnh Bắc Giang',
            date: '23/12/2024',
            mainContent: 'UBND tỉnh Bắc Giang vừa ban hành Quyết định phê duyệt Đồ án Quy hoạch phân khu số 03 thị xã Việt...',
            secondBlock: [
                {
                    content: 'Kế hoạch thực hiện Quy hoạch mạng lưới cơ sở y tế thời kỳ 2021 - 2030, tầm nhìn đến năm 2050',
                    date: '21/12/2024'
                },
                {
                    content: 'Phê duyệt Đồ án Quy hoạch phân khu số 01 thị xã Việt Yên, tỉnh Bắc Giang',
                    date: '20/12/2024'
                },
                {
                    content: 'Phê duyệt Đồ án Quy hoạch phân khu số 02 thị xã Việt Yên, tỉnh Bắc Giang',
                    date: '20/12/2024'
                },
                {
                    content: 'Phê duyệt nhiệm vụ điều chỉnh quy hoạch phân khu 4, đô thị Bắc Giang, tỉnh Bắc Giang',
                    date: '19/12/2024'
                },
                {
                    content: 'Thủ tướng chỉ đạo thực hiện các giải pháp thúc đẩy tăng trưởng kinh tế năm 2025',
                    date: '24/12/2024'
                }
            ]                
        },
    },
    { 
        id: 'tab7',
        title: 'Chiến lược - Mục tiêu phát triển',
        content: {
            img: './images/main-content/tabs/chien-luoc.jpg',
            contentTitle: 'Điều chỉnh Quy hoạch tỉnh Bắc Giang thời kỳ 2021-2030, tầm nhìn đến năm 2050',
            date: '29/10/2024',
            mainContent: 'Ngày 28/10/2024, Thủ tướng Chính phủ ban hành Quyết định số 1279/QĐ-TTg phê duyệt điều chỉnh Quy...',
            secondBlock: [
                {
                    content: 'Chương trình phát triển đô thị Biển Động, huyện Lục Ngạn, tỉnh Bắc Giang đến năm 2035',
                    date: '15/06/2024'
                },
                {
                    content: 'Bắc Giang phê duyệt kế hoạch sử dụng đất năm 2024 huyện Lạng Giang',
                    date: '13/05/2024'
                },
                {
                    content: 'Phê duyệt Kế hoạch sử dụng đất năm 2024 của huyện Yên Dũng và Hiệp Hòa',
                    date: '03/05/2024'
                },
                {
                    content: 'Phê duyệt Kế hoạch sử dụng đất thị xã Việt Yên, huyện Tân Yên năm 2024',
                    date: '19/04/2024'
                }
            ]                
        }
    }
];

const dauThauTabs = [
    { 
        id: 'tab8',
        title: 'Đấu thầu - mua sắm công',
        content: {
            img: './images/main-content/tabs/dau-thau.jpg',
            contentTitle: 'Bệnh viện Y học Cổ truyền tỉnh Bắc Giang thông báo mời thầu',
            date: '20/12/2024',
            mainContent: 'Ngày 19/12/2024, Bệnh viện Y học Cổ truyền tỉnh Bắc Giang ban hành Quyết định số 706/QĐ-BV phê...',
            secondBlock: [
                {
                    content: 'Thông báo bán đấu giá quyền sử dụng đất và tài sản gắn liền với đất có diện tích 433,8 m2',
                    date: '18/12/2024'
                },
                {
                    content: 'Thông báo bán đấu giá quyền sử dụng và tài sản gắn liền trên đất tại huyện Sơn Động',
                    date: '18/12/2024'
                },
                {
                    content: 'Thông báo bán đấu giá quyền sử dụng và tài sản gắn liền trên đất tại huyện Hiệp Hòa',
                    date: '18/12/2024'
                },
                {
                    content: 'Liên đoàn Lao động tỉnh Bắc Giang thông báo mời thầu',
                    date: '17/12/2024'
                }
            ]                
        }
    },
    { 
        id: 'tab9',
        title: 'Dự án - hạng mục đầu tư',
        content: {
            img: './images/main-content/tabs/du-an.jpg',
            contentTitle: 'Bắc Giang kêu gọi Đầu tư Dự án khu dịch vụ thương mại, thể dục thể thao hơn 186 tỷ đồng',
            date: '11/03/2024',
            mainContent: 'Sở Kế hoạch và Đầu tư tỉnh Bắc Giang vừa thông báo, mời quan tâm đối với Dự án dịch vụ thương mại...',
            secondBlock: [
                {
                    content: 'Bắc Giang: Tìm nhà đầu tư cho dự án khu đô thị mới sân golf hơn 6.000 tỷ đồng',
                    date: '07/03/2024'
                },
                {
                    content: 'Bắc Giang tìm nhà đầu tư khu đô thị 770 tỷ tại huyện Yên Dũng',
                    date: '27/02/2024'
                },
                {
                    content: 'Phê duyệt chủ trương đầu tư cầu đường sắt Cẩm Lý huyện Lục Nam tỉnh Bắc Giang',
                    date: '29/12/2023'
                },
                {
                    content: 'Bắc Giang: Phê duyệt chủ trương đầu tư Dự án khu đô thị số 5 huyện Yên Dũng',
                    date: '28/12/2023'
                }
            ]                
        },
    }
];

const soBanNganhTabs = [
    { 
        id: 'tab10',
        title: 'Sở - ban - ngành',
        content: {
            img: './images/main-content/tabs/so-ban-nganh.jpg',
            contentTitle: 'Quán triệt, triển khai thi hành một số luật, nghị quyết của Quốc hội khóa XV',
            date: '26/12/2024',
            mainContent: 'Chiều 25/12, Chính phủ phối hợp với Ủy ban Thường vụ Quốc hội tổ chức hội nghị trực tuyến toàn...',
            secondBlock: [
                {
                    content: 'Bắc Giang: Công bố Quyết định bổ nhiệm Phó Giám đốc Sở Công Thương và Phó Giám đốc Sở Y tế',
                    date: '25/12/2024'
                },
                {
                    content: 'Ngành Công Thương triển khai nhiệm vụ năm 2025',
                    date: '23/12/2024'
                },
                {
                    content: 'Ngành Nội vụ tổng kết công tác năm 2024, triển khai nhiệm vụ năm 2025',
                    date: '21/12/2024'
                },
                {
                    content: 'Bắc Giang tổ chức hội nghị kết nối, hỗ trợ hợp tác xã quảng bá sản phẩm',
                    date: '20/12/2024'
                }
            ]                
        }
    }
];

var huyenThixaThanhphoTabs = [
    { 
        id: 'tab11',
        title: 'Huyện - Thị xã - Thành phố',
        content: {
            img: './images/main-content/tabs/huyen-thixa-thanhpho.jpg',
            contentTitle: 'Bắc Giang: Công bố Quyết định bổ nhiệm Phó Giám đốc Sở Công Thương và Phó Giám đốc Sở Y tế',
            date: '25/12/2024',
            mainContent: 'Chiều 25/12, UBND tỉnh tổ chức hội nghị công bố Quyết định bổ nhiệm Phó Giám đốc Sở Công Thương...',
            secondBlock: [
                {
                    content: 'Giải chạy “Bắc Giang mùa quả ngọt” năm 2024',
                    date: '22/12/2024'
                },
                {
                    content: 'Lục Ngạn: Nhiều hoạt động đặc sắc tại Hội chợ cam, bưởi và Tuần Du lịch năm 2024g',
                    date: '21/12/2024'
                },
                {
                    content: 'Toàn văn phát biểu của Bí thư Tỉnh ủy Nguyễn Văn Gấu tại lễ ra mắt đơn vị hành chính thị xã Chũ...',
                    date: '21/12/2024'
                },
                {
                    content: 'Hơn 30 gian hàng được trưng bày tại Hội chợ cam, bưởi và Tuần Du lịch Lục Ngạn năm 2024',
                    date: '21/12/2024'
                }
            ]                
        },
    }
];

var sbnHtxtpHdtTdhcdthcnTabs = [
    { 
        id: 'tab12',
        title: 'SỞ, BAN, NGÀNH',
        content: [
            {
                link: 'http://skhdt.bacgiang.gov.vn',
                title: 'Sở Kế hoạch và Đầu tư'
            },
            {
                link: 'http://stp.bacgiang.gov.vn',
                title: 'Sở Tư Pháp'
            },
            {
                link: 'http://sct.bacgiang.gov.vn',
                title: 'Sở Công Thương'
            },
            {
                link: 'http://stc.bacgiang.gov.vn',
                title: 'Sở Tài Chính'
            },
            {
                link: 'http://snv.bacgiang.gov.vn',
                title: 'Sở Nội Vụ'
            },
            {
                link: 'http://sxd.bacgiang.gov.vn',
                title: 'Sở Xây Dựng'
            },
            {
                link: 'http://stnmt.bacgiang.gov.vn',
                title: 'Sở Tài nguyên và Môi trường'
            },
            {
                link: 'http://snnptnt.bacgiang.gov.vn',
                title: 'Sở Nông nghiệp và Phát triển Nông thôn'
            },
            {
                link: 'http://stttt.bacgiang.gov.vn',
                title: 'Sở Thông tin và Truyền thông'
            },
            {
                link: 'http://sldtbxh.bacgiang.gov.vn',
                title: 'Sở Lao động - Thương binh và Xã hội'
            },
            {
                link: 'http://sgtvt.bacgiang.gov.vn',
                title: 'Sở Giao thông vận tải'
            },
            {
                link: 'http://skhcn.bacgiang.gov.vn',
                title: 'Sở Khoa học và Công nghệ'
            },
            {
                link: 'http://svhttdl.bacgiang.gov.vn',
                title: 'Sở Văn hóa, Thể thao và Du lịch'
            },
            {
                link: 'http://songoaivu.bacgiang.gov.vn',
                title: 'Sở Ngoại vụ'
            },
            {
                link: 'http://syt.bacgiang.gov.vn',
                title: 'Sở Y tế'
            },
            {
                link: 'http://sgd.bacgiang.gov.vn',
                title: 'Sở Giáo dục và Đào tạo'
            },
            {
                link: 'http://bdt.bacgiang.gov.vn',
                title: 'Ban Dân tộc'
            },
            {
                link: 'http://bqlkcn.bacgiang.gov.vn',
                title: 'Ban Quản lý các Khu công nghiệp'
            },
            {
                link: 'http://thanhtra.bacgiang.gov.vn',
                title: 'Thanh tra tỉnh'
            },
            {
                link: 'https://dptth.bacgiang.gov.vn/',
                title: 'Đài Phát thanh - Truyền hình'
            },
            {
                link: 'https://bandanvan.bacgiang.gov.vn/',
                title: 'Ban Dân vận'
            },
            {
                link: 'https://bannoichinh.bacgiang.gov.vn/',
                title: 'Ban Nội Chính Tỉnh Bắc Giang'
            },
            {
                link: 'https://qdtpt.bacgiang.gov.vn/',
                title: 'Quỹ đầu tư phát triển tỉnh Bắc Giang'
            },
            {
                link: 'https://ubkttu.bacgiang.gov.vn/',
                title: 'Ủy ban kiểm tra Tỉnh Ủy Bắc Giang'
            }
        ]        
    },
    { 
        id: 'tab13',
        title: 'HUYỆN, THỊ XÃ, THÀNH PHỐ',
        content: [
            {
                link: 'http://tpbacgiang.bacgiang.gov.vn/',
                title: 'UBND thành phố Bắc Giang'
            },
            {
                link: 'http://lucnam.bacgiang.gov.vn',
                title: 'UBND huyện Lục Nam'
            },
            {
                link: 'http://tanyen.bacgiang.gov.vn',
                title: 'UBND huyện Tân Yên'
            },
            {
                link: 'http://vietyen.bacgiang.gov.vn/',
                title: 'UBND thị xã Việt Yên'
            },
            {
                link: 'http://hiephoa.bacgiang.gov.vn',
                title: 'UBND huyện Hiệp Hoà'
            },
            {
                link: 'http://yenthe.bacgiang.gov.vn',
                title: 'UBND huyện Yên Thế'
            },
            {
                link: 'http://sondong.bacgiang.gov.vn/',
                title: 'UBND huyện Sơn Động'
            },
            {
                link: 'http://lucngan.bacgiang.gov.vn',
                title: 'UBND huyện Lục Ngạn'
            },
            {
                link: 'http://langgiang.bacgiang.gov.vn',
                title: 'UBND huyện Lạng Giang'
            },
            {
                link: 'http://yendung.bacgiang.gov.vn/',
                title: 'UBND huyện Yên Dũng'
            }
        ]        
    },
    { 
        id: 'tab14', 
        title: 'HỘI, ĐOÀN THỂ', 
        content: [
            {
                link: 'http://mttq.bacgiang.gov.vn/',
                title: 'Ủy ban MTTQ tỉnh'
            },
            {
                link: 'https://ldld.bacgiang.gov.vn/',
                title: 'Liên đoàn Lao động tỉnh'
            },
            {
                link: 'http://hoinongdan.bacgiang.gov.vn/',
                title: 'Hội Nông dân tỉnh'
            },
            {
                link: 'https://tuoitre.bacgiang.gov.vn/',
                title: 'Đoàn TNCS Hồ Chí Minh tỉnh'
            },
            {
                link: 'https://hlhpn.bacgiang.gov.vn/',
                title: 'Hội Liên hiệp phụ nữ tỉnh'
            },
            {
                link: 'http://www.thongtincongty.com/company/c836ad45-hoi-cuu-chien-binh-tinh-bac-giang/',
                title: 'Hội Cựu chiến binh tỉnh'
            },
            {
                link: 'http://lmhtx.bacgiang.gov.vn/',
                title: 'Liên minh Hợp tác xã tỉnh'
            },
            {
                link: 'http://busta.vn/',
                title: 'Liên hiệp các Hội KHKT tỉnh'
            },
            {
                link: 'http://chuthapdobg.org.vn/',
                title: 'Hội Chữ Thập đỏ tỉnh'
            },
            {
                link: 'https://hnct.bacgiang.gov.vn/',
                title: 'Hội Người cao tuổi tỉnh Bắc Giang'
            },
            {
                link: 'https://bacgiang.gov.vn',
                title: 'Hội Luật gia tỉnh'
            },
            {
                link: 'https://bacgiang.gov.vn',
                title: 'Đoàn Luật sư tỉnh'
            },
            {
                link: 'https://hoinhabaobacgiang.vn/',
                title: 'Hội nhà báo tỉnh'
            },
            {
                link: 'http://bacgiang.gov.vn',
                title: 'Hội Khuyến học tỉnh'
            },
            {
                link: 'https://hiephoidoanhnghiep.bacgiang.gov.vn/',
                title: 'Hiệp Hội Doanh nghiệp tỉnh'
            },
            {
                link: 'http://bacgiang.gov.vn',
                title: 'Hội Văn học Nghệ thuật tỉnh'
            },
            {
                link: 'https://bgrea.bacgiang.gov.vn/',
                title: 'Hiệp Hội Bất Động Sản tỉnh'
            },
            {
                link: 'http://baovetreem.bacgiang.gov.vn/',
                title: 'Hội Bảo vệ Quyền trẻ em tỉnh'
            }
        ]        
    },
    { 
        id: 'tab15', 
        title: 'TRƯỜNG ĐH-CĐ-THCN', 
        content: [
            {
                link: 'http://bafu.edu.vn/home/',
                title: 'Trường Đại học Nông - Lâm Bắc Giang'
            },
            {
                link: 'https://cdngogiatubacgiang.edu.vn',
                title: 'Trường Cao đẳng Ngô Gia Tự Bắc Giang'
            },
            {
                link: 'https://sviet.net',
                title: 'Trường Trung cấp nghề Giao thông Vận tải tỉnh Bắc Giang'
            },
            {
                link: 'http://www.bcit.edu.vn/',
                title: 'Trường Cao đẳng Kỹ thuật Công nghiệp'
            },
            {
                link: 'https://viethanbg.wordpress.com/',
                title: 'Trường Cao đẳng nghề Công nghệ Việt - Hàn Bắc Giang'
            },
            {
                link: 'http://vhntbacgiang.edu.vn/',
                title: 'Trường Trung cấp Văn hóa, Thể thao và Du lịch Bắc Giang'
            },
            {
                link: 'https://bgmc.edu.vn/',
                title: 'Trường Cao đẳng nghề miền núi Bắc Giang'
            }
        ]
    }
];

var supportTabs = [
    { 
        id: 'tab16',
        title: 'Thông tin trợ giúp',
        content: [
            { 
                img: './images/main-content/support-icon/ico_tim_duong.png',
                title: 'Tìm đường',
                link: 'https://www.google.com/maps/place/B%E1%BA%AFc+Giang,+Vi%E1%BB%87t+Nam/@21.3743529,105.8963921,9z/data=!3m1!4b1!4m5!3m4!1s0x313510a9b346cfed:0x3c424c5b50eb50c8!8m2!3d21.3014947!4d106.6291304'
            },
            { 
                img: './images/main-content/support-icon/ico_gia_thi_truong.png',
                title: 'Giá thị trường',
                link: 'https://bacgiang.gov.vn/gia-thi-truong'
            },
            { 
                img: './images/main-content/support-icon/ico_dac_san_BG.png',
                title: 'Đặc sản Bắc Giang',
                link: 'https://bacgiang.gov.vn/dac-san-bac-giang'
            },
            { 
                img: './images/main-content/support-icon/ico_ty_gia_vang.png',
                title: 'Tỷ giá - Giá vàng',
                link: 'https://bacgiang.gov.vn/ty-gia-gia-vang'
            },
            { 
                img: './images/main-content/support-icon/ico_Taxi_bus.png',
                title: 'Taxi-Xe bus-Tàu hỏa',
                link: 'https://bacgiang.gov.vn/taxi-xe-bus-tau-hoa'
            },
            { 
                img: './images/main-content/support-icon/ico_benh_vien.png',
                title: 'Bệnh viện',
                link: 'https://bacgiang.gov.vn/benh-vien'
            },
            { 
                img: './images/main-content/support-icon/ico_vp_luat_su.png',
                title: 'Văn phòng Luật sư',
                link: 'https://bacgiang.gov.vn/van-phong-luat-su'
            },
            { 
                img: './images/main-content/support-icon/ico_thoi_tiet.png',
                title: 'Thời tiết',
                link: 'https://nchmf.gov.vn/Kttvsite/vi-VN/1/bac-giang-w46.html'
            },
            { 
                img: './images/main-content/support-icon/ico_Khu_vui_choi.png',
                title: 'Khu vui chơi-Giải trí',
                link: 'https://bacgiang.gov.vn/khu-vui-choi-giai-tri'
            },
            { 
                img: './images/main-content/support-icon/ico_school.png',
                title: 'Trường học',
                link: 'https://bacgiang.gov.vn/truong-hoc'
            },
            { 
                img: './images/main-content/support-icon/ico_vp_cong_chung.png',
                title: 'Văn phòng Công chứng',
                link: 'https://bacgiang.gov.vn/van-phong-cong-chung'
            },
            { 
                img: './images/main-content/support-icon/ico_lich_cat_dien.png',
                title: 'Lịch cắt điện',
                link: 'https://pcbacgiang.npc.com.vn/View/tabid/56/id/790/Default.aspx'
            },
            { 
                img: './images/main-content/support-icon/ico_nha_hang.png',
                title: 'Nhà hàng',
                link: 'https://bacgiang.gov.vn/nha-hang'
            },
            { 
                img: './images/main-content/support-icon/ico_ngan_hang.png',
                title: 'Ngân hàng',
                link: 'https://bacgiang.gov.vn/ngan-hang'
            },
            { 
                img: './images/main-content/support-icon/ico_tuyen_sinh_td.png',
                title: 'Tuyển sinh-Tuyển dụng',
                link: 'https://bacgiang.gov.vn/tuyen-sinh-tuyen-dung'
            },
            { 
                img: './images/main-content/support-icon/ico_lich_truyen_hinh.png',
                title: 'Lịch truyền hình',
                link: 'https://vtv.vn/lich-phat-song.htm'
            },
            { 
                img: './images/main-content/support-icon/ico_lien_he_diem_du_lich.png',
                title: 'Khách sạn',
                link: 'https://bacgiang.gov.vn/khach-san'
            },
            { 
                img: './images/main-content/support-icon/ico_diem_du_lich.png',
                title: 'Điểm du lịch-Lễ hội',
                link: 'https://bacgiang.gov.vn/diem-du-lich-le-hoi'
            },
            { 
                img: './images/main-content/support-icon/ico_so_DT_can_biet.png',
                title: 'Số điện thoại cần biết',
                link: 'https://bacgiang.gov.vn/so-dien-thoai-can-biet'
            },
            { 
                img: './images/main-content/support-icon/ico_mua_sam.png',
                title: 'Mua sắm',
                link: 'https://bacgiang.gov.vn/mua-sam'
            }
        ]         
    }
];
