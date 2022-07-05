export class ServerCode {
	static OK = 1;
	// static SystemError = -1;
	static ParamError = 100501;
	static UserNotFind = -301;
	// static UserAlreadyExisted = -302;
	static UserAlreadyExisted = 200508;
	static UserCenterNotFind = 300501;
	static UserCenterNotMatch = 300502;
	static GetOpenIDFail = 200500;
	static SystemError = 200507;
	static NotLogin = 100401;
	static NotAdmin = 100403;
	// wechat
	static NoThatPasswordORWrong = 400504;
	static HttpTimeout = -501;
	// bind
	static UsernamePasswordUnmatched = 200504;
	// static UsernamePasswordUnmatched = -500;
	static UserNotLogin = 200503;
	static NotInit = -502;
	static Unknown = -1000;
}
