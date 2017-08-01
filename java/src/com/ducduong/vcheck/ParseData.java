package com.ducduong.vcheck;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class ParseData {

	public static void main(String[] args) {

		InputStream is = ParseData.class.getResourceAsStream("/data.xlsx");
		Workbook workbook = null;

		try {
			workbook = new XSSFWorkbook(is);
			Sheet datatypeSheet = workbook.getSheetAt(0);
			Iterator<Row> iterator = datatypeSheet.iterator();
			List<String[]> datas = new ArrayList<String[]>();

			iterator.next();


			JSONObject jsonObject = new JSONObject();
			JSONArray jsonArray = new JSONArray();

			while (iterator.hasNext()) {

				Row row = iterator.next();
				String[] data = new String[4];

				for (int i = 0; i < 5; i++) {

				}

				JSONObject rowJSONObj = new JSONObject();
				rowJSONObj.put("time", getCellValue(row.getCell(1)) + " " + getCellValue(row.getCell(2)));
				rowJSONObj.put("board", row.getCell(3));
				rowJSONObj.put("violation", getCellValue(row.getCell(4)));
				rowJSONObj.put("location", getCellValue(row.getCell(5)));

				jsonArray.add(rowJSONObj);
			}

			System.out.println("Num items:" + jsonArray.size());
			jsonObject.put("date", new Date());
			jsonObject.put("items", jsonArray);

			File outFile = new File("/Users/ducduong/ws-java-master/violation-check/out/data.json");
			FileWriter fileWriter = new FileWriter(outFile);
			fileWriter.write(jsonArray.toJSONString());
			fileWriter.flush();
			fileWriter.close();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				is.close();
			} catch (Exception e) {
				e.printStackTrace();
			}

			try {
				if (workbook != null) {
					workbook.close();
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	private static String getCellValue(Cell cell) {
		// cell.setCellType(Cell.CELL_TYPE_STRING);
		if (cell.getCellTypeEnum().equals(CellType.NUMERIC)) {
			return String.valueOf(cell.getNumericCellValue());
		}

		return cell.getStringCellValue();
	}
}
