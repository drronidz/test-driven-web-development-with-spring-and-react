package com.springframework.hoxify.controller;

import com.springframework.hoxify.config.AppConfiguration;
import com.springframework.hoxify.error.ApiError;
import com.springframework.hoxify.model.FileAttachment;
import com.springframework.hoxify.model.Hox;
import com.springframework.hoxify.model.User;
import com.springframework.hoxify.repository.FileAttachmentRepository;
import com.springframework.hoxify.repository.UserRepository;
import com.springframework.hoxify.repository.HoxRepository;
import com.springframework.hoxify.service.FileService;
import com.springframework.hoxify.service.HoxService;
import com.springframework.hoxify.service.UserService;
import com.springframework.hoxify.shared.GenericResponse;
import com.springframework.hoxify.tools.TestPage;
import com.springframework.hoxify.tools.TestTools;
import com.springframework.hoxify.view.HoxVM;
import org.apache.commons.io.FileUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.transaction.TestTransaction;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceUnit;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.ParameterizedType;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.assertj.core.api.Assertions.assertThat;


/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 6/8/2022 1:52 PM
*/

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class HoxControllerTest {

    public static final String API_1_0_HOXES = "/api/1.0/hoxes";

    @Autowired
    TestRestTemplate testRestTemplate;

    @Autowired
    UserService userService;

    @Autowired
    HoxService hoxService;

    @Autowired
    FileService fileService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    HoxRepository hoxRepository;

    @Autowired
    FileAttachmentRepository fileAttachmentRepository;

    @Autowired
    AppConfiguration appConfiguration;

    @PersistenceUnit
    private EntityManagerFactory entityManagerFactory;

    @Before
    public void cleanup() throws IOException {
        fileAttachmentRepository.deleteAll();
        hoxRepository.deleteAll();
        userRepository.deleteAll();
        testRestTemplate.getRestTemplate().getInterceptors().clear();
        FileUtils.cleanDirectory(new File(appConfiguration.getFullAttachmentsPath()));
    }

    private void authenticate(String username) {
        testRestTemplate
                .getRestTemplate()
                .getInterceptors()
                .add(new BasicAuthenticationInterceptor(username, TestTools.TEST_PASSWORD));
    }

    private MultipartFile createFile() throws IOException {
        ClassPathResource imageResource = new ClassPathResource("profile.png");
        byte[] fileAsByte = FileUtils.readFileToByteArray(imageResource.getFile());

        return new MockMultipartFile("profile.png", fileAsByte);
    }


    private <T> ResponseEntity<T> postHOX(Hox hox, Class<T> responseType) {
        return testRestTemplate.postForEntity(API_1_0_HOXES, hox, responseType);
    }

    private <T> ResponseEntity<T> getHoxes(ParameterizedTypeReference<T> responseType) {
        return testRestTemplate.exchange(API_1_0_HOXES, HttpMethod.GET, null, responseType);
    }

    private <T> ResponseEntity<T> getHoxesOfUser(String username, ParameterizedTypeReference<T> responseType) {
        String path = "/api/1.0/users/" + username + "/hoxes";
        return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
    }

    private <T> ResponseEntity<T> getOldHoxes(long hoxId, ParameterizedTypeReference<T> responseType) {
        String path = API_1_0_HOXES + "/" + hoxId + "?direction=before&page=0&size=5&sort=id,desc";
        return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
    }

    private <T> ResponseEntity<T> getOldHoxesOfUser(long hoxId, String username, ParameterizedTypeReference<T> responseType) {
        String path = "/api/1.0/users/" + username + "/hoxes/" + hoxId + "?direction=before&page=0&size=5&sort=id,desc";
        return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
    }

    private <T> ResponseEntity<T> getNewHoxes(long hoxId, ParameterizedTypeReference<T> responseType){
        String path = API_1_0_HOXES + "/" + hoxId + "?direction=after&sort=id,desc";
        return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
    }

    private <T> ResponseEntity<T> getNewHoxesOfUser(long hoxId, String username, ParameterizedTypeReference<T> responseType) {
        String path = "/api/1.0/users/" + username + "/hoxes/" + hoxId + "?direction=after&sort=id,desc";
        return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
    }

    private <T> ResponseEntity<T> getNewHoxCount(long hoxId, ParameterizedTypeReference<T> responseType) {
        String path = API_1_0_HOXES + "/" + hoxId + "?direction=after&count=true";
        return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
    }

    private <T> ResponseEntity<T> getNewHoxCountUser(long hoxId, String username, ParameterizedTypeReference<T> responseType) {
        String path = "/api/1.0/users/" + username + "/hoxes/" + hoxId + "?direction=after&count=true";
        return testRestTemplate.exchange(path, HttpMethod.GET, null, responseType);
    }

    private <T> ResponseEntity<T> deleteHox(long hoxId, Class<T> responseType) {
        return testRestTemplate.exchange(API_1_0_HOXES + "/" + hoxId, 
                HttpMethod.DELETE, null, responseType);
    }

    @After
    public void cleanUpAfter() {
        fileAttachmentRepository.deleteAll();
        hoxRepository.deleteAll();
    }

    // POST

    @Test
    public void postHOX_whenHOXIsValidAndUserIsAuthorized_receiveOK() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = TestTools.createValidHOX();
        ResponseEntity<Object> responseEntity = postHOX(hox, Object.class);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void postHOX_whenHOXIsValidAndUserIsUnauthorized_receiveUnauthorized() {
        Hox hox = TestTools.createValidHOX();
        ResponseEntity<Object> responseEntity = postHOX(hox, Object.class);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }


    @Test
    public void postHOX_whenHOXIsValidAndUserIsUnauthorized_receiveAPIError() {
        Hox hox = TestTools.createValidHOX();
        ResponseEntity<ApiError> responseEntity = postHOX(hox, ApiError.class);
        assertThat(responseEntity.getBody().getStatus())
                .isEqualTo(HttpStatus.UNAUTHORIZED.value());
    }

    @Test
    public void postHOX_whenHOXIsValidAndUserIsAuthorized_HOXSavedToDataBase() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = TestTools.createValidHOX();
        postHOX(hox, Object.class);
        assertThat(hoxRepository.count()).isEqualTo(1);
    }

    @Test
    public void postHOX_whenHOXIsValidAndUserIsAuthorized_HOXSavedToDataBaseWithTimestamp() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = TestTools.createValidHOX();
        postHOX(hox, Object.class);

        Hox hoxInDB = hoxRepository.findAll().get(0);
        assertThat(hoxInDB.getTimestamp()).isNotNull();
    }

    @Test
    public void postHOX_whenHOXContentNullAndUserIsAuthorized_receiveBadRequest() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = new Hox();
        ResponseEntity<Object> responseEntity = postHOX(hox, Object.class);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void postHOX_whenHOXContentLessThan10CharactersAndUserIsAuthorized_receiveBadRequest() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = new Hox();
        hox.setContent("123456789");
        ResponseEntity<Object> responseEntity = postHOX(hox, Object.class);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void postHOX_whenHOXContentIs5000CharactersAndUserIsAuthorized_receiveOK() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = new Hox();
        String fiveThousandChars = IntStream
                .rangeClosed(1, 5000)
                .mapToObj(i -> "x")
                .collect(Collectors.joining());
        hox.setContent(fiveThousandChars);
        ResponseEntity<Object> responseEntity = postHOX(hox, Object.class);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void postHOX_whenHOXContentIsMoreThan5000CharactersAndUserIsAuthorized_receiveBadRequest() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = new Hox();
        String fiveThousandChars = IntStream.rangeClosed(1, 5002)
                .mapToObj(i -> "x")
                .collect(Collectors.joining());
        hox.setContent(fiveThousandChars);
        ResponseEntity<Object> responseEntity = postHOX(hox, Object.class);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void postHOX_whenHOXContentNullAndUserIsAuthorized_receiveApiErrorWithValidationErrors() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = new Hox();
        ResponseEntity<ApiError> responseEntity = postHOX(hox, ApiError.class);
        Map<String, String> validationErrors = responseEntity.getBody().getValidationErrors();
        assertThat(validationErrors.get("content")).isNotNull();
    }

    @Test
    public void postHOX_whenHOXIsValidAndUserIsAuthorized_HOXSavedWithAuthenticatedUserInformation() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = TestTools.createValidHOX();
        postHOX(hox, Object.class);

        Hox hoxInDB = hoxRepository.findAll().get(0);
        assertThat(hoxInDB.getUser().getUsername()).isEqualTo("user1");
    }

    @Test
    public void postHOX_whenHOXIsValidAndUserIsAuthorized_HOXCanBeAccessedFromUserEntity() {
        User user = userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = TestTools.createValidHOX();
        postHOX(hox, Object.class);

        EntityManager entityManager = entityManagerFactory.createEntityManager();

        User userInDB = entityManager.find(User.class, user.getId());
        assertThat(userInDB.getHoxes().size()).isEqualTo(1);
    }

    @Test
    public void postHOX_whenHOXIsValidAndUserIsAuthorized_receiveHoxVM() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = TestTools.createValidHOX();
        ResponseEntity<HoxVM> responseEntity = postHOX(hox, HoxVM.class);
        assertThat(responseEntity.getBody().getUser().getUsername()).isEqualTo("user1");
    }

    @Test
    public void postHox_whenHoxHasFileAttachmentAndUserIsAuthorized_fileAttachmentHoxRelationIsUpdatedInDB() throws IOException {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");

        MultipartFile file = createFile();

        FileAttachment savedAttachment = fileService.saveAttachment(file);

        Hox hox = TestTools.createValidHOX();
        hox.setAttachment(savedAttachment);

        ResponseEntity<HoxVM> responseEntity = postHOX(hox, HoxVM.class);

        FileAttachment fileAttachmentInDB = fileAttachmentRepository.findAll().get(0);
        assertThat(fileAttachmentInDB.getHox().getId()).isEqualTo(responseEntity.getBody().getId());
    }

    @Test
    public void postHox_whenHoxHasFileAttachmentAndUserIsAuthorized_hoxFileAttachmentRelationIsUpdatedInDB() throws IOException {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");

        MultipartFile file = createFile();

        FileAttachment savedAttachment = fileService.saveAttachment(file);

        Hox hox = TestTools.createValidHOX();
        hox.setAttachment(savedAttachment);
        ResponseEntity<HoxVM> responseEntity = postHOX(hox, HoxVM.class);

        Hox hoxInDB = hoxRepository.findById(responseEntity.getBody().getId()).get();
        assertThat(hoxInDB.getAttachment().getId()).isEqualTo(savedAttachment.getId());
    }



    @Test
    public void postHox_whenHoxHasFileAttachmentAndUserIsAuthorized_receiveHoxVMWithAttachment() throws IOException {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");

        MultipartFile file = createFile();

        FileAttachment savedAttachment = fileService.saveAttachment(file);

        Hox hox = TestTools.createValidHOX();
        hox.setAttachment(savedAttachment);
        ResponseEntity<HoxVM> responseEntity = postHOX(hox, HoxVM.class);

        assertThat(responseEntity.getBody().getAttachment().getName()).isEqualTo(savedAttachment.getName());
    }

    // GET

    @Test
    public void getHoxes_whenThereAreNoHoxes_receiveOK() {
        ResponseEntity<Object> response = getHoxes(new ParameterizedTypeReference<Object>() {});
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void getHoxes_whenThereAreNoHoxes_receivePageWithZeroItems() {
        ResponseEntity<TestPage<Object>> response = getHoxes(new ParameterizedTypeReference<TestPage<Object>>() {});
        assertThat(response.getBody().getTotalElements()).isEqualTo(0);
    }

    @Test
    public void getHoxes_whenThereAreHoxes_receivePageWithItems() {
        User user = userService.save(TestTools.createValidUser("user1"));
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        ResponseEntity<TestPage<Object>> response = getHoxes(new ParameterizedTypeReference<TestPage<Object>>() {});
        assertThat(response.getBody().getTotalElements()).isEqualTo(3);
    }

    @Test
    public void getHoxes_whenThereAreHoxes_receivePageWithHoxVM() {
        User user = userService.save(TestTools.createValidUser("user1"));
        hoxService.save(user, TestTools.createValidHOX());

        ResponseEntity<TestPage<HoxVM>> response =
                getHoxes(new ParameterizedTypeReference<TestPage<HoxVM>>() {});
        HoxVM storedHoxVM = response.getBody().getContent().get(0);
        assertThat(storedHoxVM.getUser().getUsername()).isEqualTo("user1");
    }

    @Test
    public void getHoxesOfUser_whenUserExists_receiveOK() {
        userService.save(TestTools.createValidUser("user1"));
        ResponseEntity<Object> response = getHoxesOfUser("user1",
                new ParameterizedTypeReference<Object>() {});
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void getHoxesOfUser_whenUserDoesNotExists_receiveNotFound() {
        ResponseEntity<Object> response = getHoxesOfUser("unknown",
                new ParameterizedTypeReference<Object>() {});
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    public void getHoxesOfUser_whenUserExists_receivePageWithZeroHoxes() {
        userService.save(TestTools.createValidUser("user1"));
        ResponseEntity<TestPage<Object>> response = getHoxesOfUser("user1",
                new ParameterizedTypeReference<TestPage<Object>>() {});
        assertThat(response.getBody().getTotalElements()).isEqualTo(0);
    }

    @Test
    public void getHoxesOfUser_whenUserExistsWithHox_receivePageWithHoxVM() {
        User user = userService.save(TestTools.createValidUser("user1"));
        hoxService.save(user, TestTools.createValidHOX());
        ResponseEntity<TestPage<HoxVM>> response = getHoxesOfUser("user1",
                new ParameterizedTypeReference<TestPage<HoxVM>>() {});
        HoxVM storedHox = response.getBody().getContent().get(0);
        assertThat(storedHox.getUser().getUsername()).isEqualTo("user1");
    }

    @Test
    public void getHoxesOfUser_whenUserExistsWithMultipleHoxes_receivePageWithMatchingHoxCount() {
        User user = userService.save(TestTools.createValidUser("user1"));
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        ResponseEntity<TestPage<HoxVM>> response = getHoxesOfUser("user1",
                new ParameterizedTypeReference<TestPage<HoxVM>>() {});
        assertThat(response.getBody().getTotalElements()).isEqualTo(3);
    }

    @Test
    public void getHoxesOfUser_whenMultipleUserExistWithMultipleHoxes_receivePageWithMatchingHoxesCount() {
        User userOneWithThreeHoxes = userService.save(TestTools.createValidUser("user1"));
        IntStream.rangeClosed(1, 3).forEach( item -> {
            hoxService.save(userOneWithThreeHoxes, TestTools.createValidHOX());
        });

        User userTwoWithFiveHoxes = userService.save(TestTools.createValidUser("user2"));
        IntStream.rangeClosed(1, 5).forEach( item -> {
            hoxService.save(userTwoWithFiveHoxes, TestTools.createValidHOX());
        });

        ResponseEntity<TestPage<HoxVM>> response = getHoxesOfUser(userTwoWithFiveHoxes.getUsername(),
                new ParameterizedTypeReference<TestPage<HoxVM>>() {});
        assertThat(response.getBody().getTotalElements()).isEqualTo(5);
    }

    @Test
    public void getOldHoxes_whenThereAreNoHoxes_receiveOK() {
        ResponseEntity<Object> response =
                getOldHoxes(5, new ParameterizedTypeReference<Object>() {});
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void getOldHoxes_whenThereAreHoxes_receivePageWithItemsProvidedId() {
        User user = userService.save(TestTools.createValidUser("user1"));
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        Hox hoxFour = hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());

        ResponseEntity<TestPage<Object>> response =
                getOldHoxes(hoxFour.getId(), new ParameterizedTypeReference<TestPage<Object>>() {});

        assertThat(response.getBody()).isEqualTo(3);
    }

    @Test
    public void getOldHoxes_whenThereAreHoxes_receivePageWithHoxVMBeforeProvidedId() {
        User user = userService.save(TestTools.createValidUser("user1"));
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        Hox hoxFour = hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());

        ResponseEntity<TestPage<HoxVM>> response =
                getOldHoxes(hoxFour.getId(), new ParameterizedTypeReference<TestPage<HoxVM>>() {});

        assertThat(response.getBody().getContent().get(0).getDate()).isGreaterThan(0);
    }

    @Test
    public void getOldHoxesOfUser_whenUserExistsThereAreNoHoxes_receiveOK() {
        userService.save(TestTools.createValidUser("user1"));
        ResponseEntity<Object> response =
                getOldHoxesOfUser(5, "user1", new ParameterizedTypeReference<Object>() {});
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void getOldHoxesOfUser_whenUserExistsAndThereAreHoxes_receivePageWithHoxVMBeforeProvidedId() {
        User user = userService.save(TestTools.createValidUser("user1"));
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        Hox hoxFour = hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());

        ResponseEntity<TestPage<HoxVM>> response =
                getOldHoxesOfUser(hoxFour.getId(), "user1", new ParameterizedTypeReference<TestPage<HoxVM>>() {});

        assertThat(response.getBody().getContent().get(0).getDate()).isGreaterThan(0);
    }

    @Test
    public void getOldHoxesOfUser_whenUserExistAndThereAreHoxes_receivePageWithHoxVMBeforeProvidedId() {
        User user = userService.save(TestTools.createValidUser("user1"));
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        Hox hoxFour = hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());

        ResponseEntity<TestPage<HoxVM>> response =
                getOldHoxesOfUser(hoxFour.getId(), "user1", new ParameterizedTypeReference<TestPage<HoxVM>>() {});

        assertThat(response.getBody().getContent().get(0).getDate()).isGreaterThan(0);
    }

    @Test
    public void getOldHoxesOfUser_whenUserDoesNotExistsThereAreNoHoxes_receiveNotFound() {
        ResponseEntity<Object> response = getOldHoxesOfUser(5, "user1", new ParameterizedTypeReference<Object>() {});
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    public void getOldHoxesOfUser_whenUserExistAndThereAreNoHoxes_receivePageWithZeroItemsBeforeProvidedId() {
        User user = userService.save(TestTools.createValidUser("user1"));
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        Hox hoxFour = hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());

        userService.save(TestTools.createValidUser("user2"));

        ResponseEntity<TestPage<HoxVM>> response =
                getOldHoxesOfUser(hoxFour.getId(), "user2", new ParameterizedTypeReference<TestPage<HoxVM>>() {});

        assertThat(response.getBody().getTotalElements()).isEqualTo(0);
    }

    @Test
    public void getNewHox_whenThereAreHoxes_receiveListOfItemsAfterProvidedId() {
        User user = userService.save(TestTools.createValidUser("user1"));
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        Hox hoxFour = hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());

        ResponseEntity<List<Object>> response =
                getNewHoxes(hoxFour.getId(), new ParameterizedTypeReference<List<Object>>() {});

        assertThat(response.getBody().size()).isEqualTo(1);
    }

    @Test
    public void getNewHoxes_whenThereAreHoxes_receiveListOfHoxVMAfterProvidedId() {
        User user = userService.save(TestTools.createValidUser("user1"));
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        Hox hoxFour = hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());

        ResponseEntity<List<HoxVM>> response =
                getNewHoxes(hoxFour.getId(), new ParameterizedTypeReference<List<HoxVM>>() {});

        assertThat(response.getBody().get(0).getDate()).isGreaterThan(0);
    }


    @Test
    public void getNewHoxesOfUser_whenUserExistsThereAreNoHoxes_receiveOK() {
        userService.save(TestTools.createValidUser("user1"));
        ResponseEntity<Object> response =
                getNewHoxesOfUser(5, "user1", new ParameterizedTypeReference<Object>() {});
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void getNewHoxesOfUser_whenUserExistsAndThereAreHoxes_receiveListWithItemsAfterProvidedId() {
        User user = userService.save(TestTools.createValidUser("user1"));
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        Hox hoxFour = hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());

        ResponseEntity<List<Object>> response =
                getNewHoxesOfUser(hoxFour.getId(), "user1", new ParameterizedTypeReference<List<Object>>() {});

        assertThat(response.getBody().size()).isEqualTo(1);
    }

    @Test
    public void getNewHoxesOfUser_whenUserExistAndThereAreHoxes_receiveListWithHoxVMAfterProvidedId() {
        User user = userService.save(TestTools.createValidUser("user1"));
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        Hox hoxFour = hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());

        ResponseEntity<List<HoxVM>> response =
                getNewHoxesOfUser(hoxFour.getId(), "user1", new ParameterizedTypeReference<List<HoxVM>>() {});

        assertThat(response.getBody().get(0).getDate()).isGreaterThan(0);
    }

    @Test
    public void getNewHoxesOfUser_whenUserDoesNotExistsThereAreNoHoxes_receiveNotFound() {
        ResponseEntity<Object> response = getNewHoxesOfUser(5, "user1", new ParameterizedTypeReference<Object>() {});
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    public void getNewHoxesOfUser_whenUserExistAndThereAreNoHoxes_receiveListWithZeroItemsAfterProvidedId() {
        User user = userService.save(TestTools.createValidUser("user1"));
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        Hox hoxFour = hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());

        userService.save(TestTools.createValidUser("user2"));

        ResponseEntity<List<HoxVM>> response =
                getNewHoxesOfUser(hoxFour.getId(), "user2", new ParameterizedTypeReference<List<HoxVM>>() {});

        assertThat(response.getBody().size()).isEqualTo(0);
    }

    @Test
    public void getNewHoxCount_whenThereAreHoxes_receiveCountAfterProvidedId() {
        User user = userService.save(TestTools.createValidUser("user1"));
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        Hox hoxFour = hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());

        ResponseEntity<Map<String, Long>> response =
                getNewHoxCount(hoxFour.getId(), new ParameterizedTypeReference<Map<String, Long>>() {});

        assertThat(response.getBody().get("count")).isEqualTo(1);
    }

    @Test
    public void getNewHoxCountOfUser_whenThereAreHoxes_receiveCountAfterProvidedId() {
        User user = userService.save(TestTools.createValidUser("user1"));
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());
        Hox hoxFour = hoxService.save(user, TestTools.createValidHOX());
        hoxService.save(user, TestTools.createValidHOX());

        ResponseEntity<Map<String, Long>> response =
                getNewHoxCountUser(
                        hoxFour.getId(), "user1",
                        new ParameterizedTypeReference<Map<String, Long>>() {});

        assertThat(response.getBody().get("count")).isEqualTo(1);
    }

    // DELETE


    @Test
    public void deleteHox_whenUserIsUnauthorized_receiveUnauthorized() {
        ResponseEntity<Object> response = deleteHox(555, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    public void deleteHox_whenUserIsAuthorized_receiveOK() {
        User user = userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = hoxService.save(user, TestTools.createValidHOX());

        ResponseEntity<Object> response = deleteHox(hox.getId(), Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void deleteHox_whenUserIsAuthorized_receiveGenericResponse() {
        User user = userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = hoxService.save(user, TestTools.createValidHOX());

        ResponseEntity<GenericResponse> response = deleteHox(hox.getId(), GenericResponse.class);
        assertThat(response.getBody().getMessage()).isNotNull();
    }

    @Test
    public void deleteHox_whenUserIsAuthorized_hoxIsRemovedFromDB() {
        User user = userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        Hox hox = hoxService.save(user, TestTools.createValidHOX());

        deleteHox(hox.getId(), Object.class);
        Optional<Hox> hoxInDB = hoxRepository.findById(hox.getId());

        assertThat(hoxInDB.isPresent()).isFalse();
    }

    @Test
    public void deleteHox_whenHoxIsOwnedByAnotherUser_receiveForbidden() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");

        User userOwner = userService.save(TestTools.createValidUser("hox-owner"));

        Hox hox = hoxService.save(userOwner, TestTools.createValidHOX());

        ResponseEntity<Object> response = deleteHox(hox.getId(), Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    public void deleteHox_whenHoxDoesNotExist_receiveForbidden() {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");
        ResponseEntity<Object> response = deleteHox(55, Object.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    public void deleteBox_whenBoxHasAttachment_attachmentRemovedFromDB() throws IOException {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");

        MultipartFile file = createFile();

        FileAttachment hoxAttachment = fileService.saveAttachment(file);

        Hox hox = TestTools.createValidHOX();
        hox.setAttachment(hoxAttachment);
        ResponseEntity<HoxVM> response = postHOX(hox, HoxVM.class);

        long hoxId = response.getBody().getId();

        deleteHox(hoxId, Object.class);

        Optional<FileAttachment> optionalFileAttachment =
                fileAttachmentRepository
                        .findById(hoxAttachment.getId());

        assertThat(optionalFileAttachment.isPresent()).isFalse();
    }

    @Test
    public void deleteHox_whenHoxHasAttachment_attachmentRemovedFromStorage() throws IOException {
        userService.save(TestTools.createValidUser("user1"));
        authenticate("user1");

        MultipartFile file = createFile();

        FileAttachment hoxAttachment = fileService.saveAttachment(file);

        Hox hox = TestTools.createValidHOX();
        hox.setAttachment(hoxAttachment);
        ResponseEntity<HoxVM> response = postHOX(hox, HoxVM.class);

        long hoxId = response.getBody().getId();

        deleteHox(hoxId, Object.class);

        String attachmentFolderPath =
                appConfiguration
                        .getFullAttachmentsPath() + "/" + hoxAttachment.getName();

        File storedImage = new File(attachmentFolderPath);

        assertThat(storedImage.exists()).isFalse();
    }
}