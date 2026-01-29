package kr.or.dasancall.service.impl;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.or.dasancall.service.DashboardVO;
import kr.or.dasancall.service.MainService;

@Service("mainService")
public class MainServiceImpl implements MainService {

	@Resource(name = "mainMapper")
	private MainMapper mainMapper;
	
	@Override
	public List<HashMap<String, Object>> selectDataList(DashboardVO vo) throws Exception {
		return mainMapper.selectDataList(vo);
	}

}
