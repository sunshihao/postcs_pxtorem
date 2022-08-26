// import CommonImage from '@/components/CommonImage';
// import { connect, useLocation } from '@umijs/max';
// import { Button, Image, message, Modal } from 'antd';
// import React, { useEffect, useState } from 'react';
// import { history, useModel } from 'umi';
// import Agreement from './agreement';
import './main.css';

const LoginSSO: React.FC = ({ dispatch, loading, loadingSSO }) => {
  const location = useLocation();
  const [useShowAgm, setUseShowAgm] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');

  /** SSO 登录 */
  const onLoginSSO = () => {
    // 跳转到华云盾登录
    window.location.href = `http://idtest.chinaoct.com:9080/bim-webservice/api/identity/authorize?client_id=cgsc&client_secret=2038c66113414f0bbac4a1c7838ec5ad&state=1&redirect_uri=http://${window.location.host}/shop/loginSSO`;
  };

  useEffect(() => {
    // 比较两次props的变化

    // console.log('location', location);

    if (location.search) {
      // const params1 = _.replace(location.search, '?', '');
      // console.log('_.trimStart(location.search)', _.trimStart(location.search, '?'))
      // _.trimStart(location.search, '?').split('&');
      // const params2 = _.replace(params1.split('&')[0], 'code=', '');
      // console.log('location.search', location.search);
      // console.log(queryParams);
      // console.log('queryParams', queryParams.get('code'));
      const queryParams = new URLSearchParams(location.search);

      // 指定code必须走默认登录
      if (queryParams.get('code')) {
        dispatch({
          type: 'user/loginSSO',
          payload: {
            authType: 'HUAYUNDUNCODE',
            clientType: 'client_app',
            username: 'username111',
            password: 'password111',
            grant_type: 'password',
            client_id: 'scm_web_manage',
            huayundunCode: queryParams.get('code'),
          },
          callback: async () => {
            const userInfo = await initialState?.fetchUserInfo();

            if (userInfo) {
              message.success('登录成功');
              history.push('/home');

              setInitialState((s) => ({
                ...s,
                userInfo,
              }));
            }
          },
        });
      }

      // 若是有登录标志则跳转到登录标志
      if (queryParams.get('loginType')) {
        onLoginSSO();
      }
    }
  }, [location.search]);

  /** 模拟登录 */
  const onLogin = async () => {
    await dispatch({
      type: 'user/login',
      callback: async () => {
        const userInfo = await initialState?.fetchUserInfo();
        if (userInfo) {
          setInitialState((s) => ({
            ...s,
            userInfo,
          }));
        }
      },
    });
  };

  return (
    <div className="sso_login_home ignore_home">
      <div className="logo_area">
        <img src="img/common/logo.png" style={{ width: '160px', height: '54px' }} />
      </div>
      <div className="swapper_area">
        <CommonImage
          style={{ objectFit: 'cover' }}
          width={'100%'}
          height="100%"
          src="img/home/login_bg.jpg"
          preview={false}
          placeholder={
            <Image
              preview={false}
              src="img/home/login_bg_place.jpg"
              width={'100%'}
              height="100%"
              style={{ objectFit: 'cover' }}
            />
          }
        />
        <img src="img/home/login_text.png" className="login_text_img" />
        <div className="login_sso_area">
          <div className="hyd_area">
            <div>
              <div className="text1">OCT Vendor Managemet System</div>
              <div className="text2" style={{ marginTop: '8px' }}>
                华侨城采购管理系统
              </div>
              <div className="text3" style={{ marginTop: '8px' }}>
                企业用户登录
              </div>
            </div>
            <div style={{ zIndex: '10' }}>
              {/* TODO屏蔽 */}
              {/* <div style={{ height: '48px', width: '100%' }}>
                <Button
                  type="primary"
                  className="shop_comp_price_modal_btn"
                  style={{ height: '100%', width: '100%' }}
                  onClick={onLogin}
                  loading={loading}
                >
                  华云盾登录(模拟)
                </Button>
              </div>
              <div style={{ height: '20px' }} /> */}
              {/* TODO屏蔽 */}
              <div style={{ height: '48px', width: '100%' }}>
                <Button
                  type="primary"
                  className="shop_comp_price_modal_btn"
                  style={{ height: '100%', width: '100%' }}
                  onClick={onLoginSSO}
                  loading={loadingSSO}
                >
                  华云盾登录
                </Button>
              </div>
              {/* <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <a onClick={() => setUseShowAgm(true)}>《华侨城采购服务协议》</a>
                <a onClick={() => setUseShowAgm(true)}>《隐私政策》</a>
              </div> */}
            </div>
            <img src="img/common/hyd.png" className="img" />
          </div>
          <div className="suggest">
            建议您使用Google Chrome、IE11+、FireFox
            浏览器，且屏幕分辨率在1280*800以上，浏览本网站，获得更好用户体验。
          </div>
        </div>
      </div>
      <Modal
        visible={useShowAgm}
        footer={null}
        zIndex={2000}
        title={null}
        width={'fit-content'}
        style={{ height: '800px' }}
        destroyOnClose={true}
        maskClosable={true}
        onCancel={() => setUseShowAgm(false)}
      >
        <Agreement />
      </Modal>
    </div>
  );
};

export default connect(({ user, loading }) => ({
  user,
  loading: loading.effects['user/login'] || false,
  loadingSSO: loading.effects['user/loginSSO'] || false,
}))(LoginSSO);
