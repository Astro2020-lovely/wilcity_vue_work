export const mobileHelper = {
  isMobile(type) {
    switch (type) {
      case "Android":
        status = navigator.userAgent.match(/Android/i);
        break;
      case "BlackBerry":
        status = navigator.userAgent.match(/BlackBerry/i);
        break;
      case "IOS":
        status = navigator.userAgent.match(/iPhone|iPad|iPod/i);
        break;
      case "Opera":
        status = navigator.userAgent.match(/Opera Mini/i);
        break;
      case "Windows":
        status = navigator.userAgent.match(/IEMobile/i);
        break;
      default:
        status =
          mobileHelper.isMobile("Android") ||
          mobileHelper.isMobile("BlackBerry") ||
          mobileHelper.isMobile("IOS") ||
          mobileHelper.isMobile("Opera") ||
          mobileHelper.isMobile("Windows");
        break;
    }

    return _.isArray(status) && status.length;
  }
};
