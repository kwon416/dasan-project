package kr.or.dasancall.cmmn;

import org.egovframe.rte.fdl.cmmn.exception.handler.ExceptionHandler;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * 다산콜 기본 예외 핸들러
 */
public class DasanExcepHndlr implements ExceptionHandler {

	private static final Logger logger = LogManager.getLogger(DasanExcepHndlr.class);

	@Override
	public void occur(Exception ex, String packageName) {
		logger.error("[DasanExcepHndlr] {} - {}", packageName, ex.getMessage());
	}
}
