package com.springframework.hoxify.service;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 6/8/2022 2:34 PM
*/

import com.springframework.hoxify.model.Hox;
import com.springframework.hoxify.model.User;
import com.springframework.hoxify.repository.HoxRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.Date;
import java.util.List;

@Service
@RequestMapping("/api/1.0")
public class HoxService {

    private final HoxRepository hoxRepository;
    private final UserService userService;

    public HoxService(HoxRepository hoxRepository, UserService userService) {
        this.hoxRepository = hoxRepository;
        this.userService = userService;
    }

//    public void save(Hox hox) {
//        hox.setTimestamp(new Date());
//        hoxRepository.save(hox);
//    }

    public Hox save(User user, Hox hox) {
        hox.setTimestamp(new Date());
        hox.setUser(user);
        return hoxRepository.save(hox);
    }

    public Page<Hox> getAllHoxes(Pageable pageable) {
        return hoxRepository.findAll(pageable);
    }

    public Page<Hox> getHoxesOfUser(String username, Pageable pageable) {
        User userInDB = userService.getByUsername(username);
        return hoxRepository.findByUser(userInDB, pageable);
    }

    public Page<Hox> getOldHoxes(long id, String username, Pageable pageable) {
        Specification<Hox> specification = Specification.where(idLessThan(id));

//        return (username == null
//                ? hoxRepository.findByIdLessThan(id, pageable)
//                : hoxRepository.findByIdLessThanAndUser(id, userService.getByUsername(username), pageable));
        return (username == null
                ? hoxRepository.findAll(specification, pageable)
                : hoxRepository.findAll(specification.and(userIs(userService.getByUsername(username))), pageable));

    }

//    public Page<Hox> getOldHoxesOfUser(long id, String username, Pageable pageable) {
//        User userInDB = userService.getByUsername(username);
//        return hoxRepository.findByIdLessThanAndUser(id, userInDB, pageable);
//    }

    public List<Hox> getNewHoxes(long id, String username, Pageable pageable) {
        Specification<Hox> specification = Specification.where(idGreaterThan(id));
        return (username == null
                ? hoxRepository.findAll(specification, pageable.getSort())
                : hoxRepository.findAll(specification.and(userIs(userService.getByUsername(username))), pageable.getSort()));
    }

//    public List<Hox> getNewHoxesOfUser(long id, String username, Pageable pageable) {
//        User userInDB = userService.getByUsername(username);
//        return hoxRepository.findByIdGreaterThanAndUser(id, userInDB, pageable.getSort());
//    }

    public long getNewHoxesCount(long id, String username) {
        Specification<Hox> specification = Specification.where(idGreaterThan(id));
        return (username == null
                ? hoxRepository.count(specification)
                : hoxRepository.count(specification.and(userIs(userService.getByUsername(username)))));
    }

//    public long getNewHoxesCountOfUser(long id, String username) {
//        User userInDB = userService.getByUsername(username);
//        return hoxRepository.countByIdGreaterThanAndUser(id, userInDB);
//    }

    private Specification<Hox> userIs(User user) {
        return ((root, query, criteriaBuilder)
                ->
                criteriaBuilder.equal(root.get("user"), user));
    }

    private Specification<Hox> idLessThan(long id) {
        return ((root, query, criteriaBuilder)
                ->
                criteriaBuilder.lessThan(root.get("id"), id));
    }

    private Specification<Hox> idGreaterThan(long id) {
        return ((root, query, criteriaBuilder)
                ->
                criteriaBuilder.greaterThan(root.get("id"), id));
    }
}
